import razorpay

from django.conf import settings

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
            return Payment.objects.all()

        return Payment.objects.filter(
            user=user
        )

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