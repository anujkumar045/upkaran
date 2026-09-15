import razorpay

from django.conf import settings
from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Payment
from .serializers import PaymentSerializer


class PaymentViewSet(viewsets.ModelViewSet):

    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        if user.is_staff or user.role == "admin":
            return Payment.objects.select_related("user", "equipment", "booking").all()

        return Payment.objects.select_related("user", "equipment", "booking").filter(user=user)

    @action(
        detail=False,
        methods=["post"],
        url_path="create-purchase-order"
    )
    def create_purchase_order(self, request):
        equipment_id = request.data.get("equipment")

        if not equipment_id:
            return Response({"error": "Equipment ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        from marketplace.models import Equipment

        try:
            equipment = Equipment.objects.get(id=equipment_id, is_available=True)
        except Equipment.DoesNotExist:
            return Response({"error": "Equipment not found or unavailable."}, status=status.HTTP_404_NOT_FOUND)

        if equipment.price <= 0:
            return Response({"error": "This equipment is not available for purchase."}, status=status.HTTP_400_BAD_REQUEST)

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        amount_in_paise = int(equipment.price * 100)
        razorpay_order = client.order.create({
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": f"purchase_{equipment.id}_{request.user.id}",
        })

        payment = Payment.objects.create(
            user=request.user,
            equipment=equipment,
            payment_type="purchase",
            amount=equipment.price,
            razorpay_order_id=razorpay_order["id"],
            status="created",
        )

        return Response({
            "payment_id": payment.id,
            "razorpay_order_id": razorpay_order["id"],
            "amount": amount_in_paise,
            "currency": "INR",
            "key_id": settings.RAZORPAY_KEY_ID,
            "equipment_name": equipment.name,
        }, status=status.HTTP_201_CREATED)

    @action(
        detail=False,
        methods=["post"],
        url_path="verify"
    )
    def verify(self, request):
        payment_id = request.data.get("payment_id")
        razorpay_payment_id = request.data.get("razorpay_payment_id")
        razorpay_order_id = request.data.get("razorpay_order_id")
        razorpay_signature = request.data.get("razorpay_signature")

        try:
            payment = Payment.objects.get(
                id=payment_id,
                user=request.user,
                razorpay_order_id=razorpay_order_id
            )
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            client.utility.verify_payment_signature({
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
            })
        except (Payment.DoesNotExist, razorpay.errors.SignatureVerificationError):
            return Response({"error": "Payment verification failed."}, status=status.HTTP_400_BAD_REQUEST)

        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        payment.status = "captured"
        payment.paid_at = timezone.now()
        payment.save(update_fields=[
            "razorpay_payment_id", "razorpay_signature", "status", "paid_at", "updated_at"
        ])

        if payment.booking_id:
            payment.booking.payment_status = "paid"
            payment.booking.transaction_id = razorpay_payment_id
            payment.booking.save(update_fields=["payment_status", "transaction_id", "updated_at"])

        return Response({"message": "Payment verified successfully."}, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["post"],
        url_path="create-order"
    )
    def create_order(self, request):

        booking_id = request.data.get("booking")

        if not booking_id:
            return Response(
                {
                    "error": "Booking ID is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Import here to avoid circular imports
        from bookings.models import Booking

        try:
            booking = Booking.objects.get(
                id=booking_id,
                user=request.user
            )

        except Booking.DoesNotExist:
            return Response(
                {
                    "error": "Booking not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Check existing payment
        if Payment.objects.filter(
            booking=booking
        ).exists():

            return Response(
                {
                    "error": "Payment already exists for this booking."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get booking amount
        amount = booking.total_amount

        # Razorpay client
        client = razorpay.Client(
            auth=(
                settings.RAZORPAY_KEY_ID,
                settings.RAZORPAY_KEY_SECRET
            )
        )

        # Razorpay amount is in paise
        amount_in_paise = int(amount * 100)

        # Create Razorpay order
        razorpay_order = client.order.create(
            {
                "amount": amount_in_paise,
                "currency": "INR",
                "receipt": f"booking_{booking.id}",
            }
        )

        # Save payment in database
        payment = Payment.objects.create(
            booking=booking,
            user=request.user,
            amount=amount,
            payment_type="rental",
            razorpay_order_id=razorpay_order["id"],
            status="created"
        )

        return Response(
            {
                "message": "Razorpay order created successfully.",
                "payment_id": payment.id,
                "razorpay_order_id": razorpay_order["id"],
                "amount": amount_in_paise,
                "currency": "INR",
                "key_id": settings.RAZORPAY_KEY_ID
            },
            status=status.HTTP_201_CREATED
        )