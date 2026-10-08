from uuid import uuid4

from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import (
    FormParser,
    MultiPartParser,
    JSONParser,
)

from .models import Payment
from .serializers import PaymentSerializer


class PaymentViewSet(viewsets.ModelViewSet):

    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    # =========================================================
    # GET PAYMENTS
    # =========================================================

    def get_queryset(self):

        user = self.request.user

        if user.is_staff or user.role == "admin":
            return Payment.objects.select_related(
                "user",
                "equipment",
                "booking"
            ).all()

        return Payment.objects.select_related(
            "user",
            "equipment",
            "booking"
        ).filter(
            user=user
        )

    # =========================================================
    # ADMIN APPROVE MANUAL PAYMENT
    # =========================================================

    @action(
        detail=True,
        methods=["post"]
    )
    def approve(self, request, pk=None):

        if not (
            request.user.is_staff
            or request.user.role == "admin"
        ):
            return Response(
                {
                    "error": (
                        "Only an admin can approve payments."
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )

        payment = self.get_object()

        payment.status = "captured"
        payment.paid_at = timezone.now()

        payment.save(
            update_fields=[
                "status",
                "paid_at",
                "updated_at"
            ]
        )

        if payment.booking_id:

            payment.booking.payment_status = "paid"

            payment.booking.save(
                update_fields=[
                    "payment_status",
                    "updated_at"
                ]
            )

        return Response(
            {
                "message": (
                    "Payment approved successfully."
                )
            },
            status=status.HTTP_200_OK
        )

    # =========================================================
    # CREATE PURCHASE PAYMENT
    # =========================================================

    @action(
        detail=False,
        methods=["post"],
        url_path="create-purchase-order"
    )
    def create_purchase_order(self, request):

        equipment_id = request.data.get(
            "equipment"
        )

        if not equipment_id:
            return Response(
                {
                    "error": (
                        "Equipment ID is required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        from marketplace.models import Equipment

        try:

            equipment = Equipment.objects.get(
                id=equipment_id,
                is_available=True
            )

        except Equipment.DoesNotExist:

            return Response(
                {
                    "error": (
                        "Equipment not found "
                        "or unavailable."
                    )
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if equipment.price <= 0:

            return Response(
                {
                    "error": (
                        "This equipment is not "
                        "available for purchase."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        amount_in_paise = int(
            equipment.price * 100
        )

        payment_reference = (
            f"UPK-P-{uuid4().hex[:12].upper()}"
        )

        payment = Payment.objects.create(
            user=request.user,
            equipment=equipment,
            payment_type="purchase",
            amount=equipment.price,
            payment_reference=payment_reference,
            status="created",
        )

        return Response(
            {
                "payment_id": payment.id,
                "payment_reference": payment_reference,
                "amount": amount_in_paise,
                "currency": "INR",
                "equipment_name": equipment.name,
            },
            status=status.HTTP_201_CREATED
        )

    # =========================================================
    # VERIFY MANUAL PAYMENT
    # =========================================================

    @action(
        detail=False,
        methods=["post"],
        url_path="verify"
    )
    def verify(self, request):

        return self.submit_payment(request)

    def submit_payment(self, request):

        payment_id = request.data.get(
            "payment_id"
        )

        try:

            payment = Payment.objects.get(
                id=payment_id,
                user=request.user
            )

        except Payment.DoesNotExist:

            return Response(
                {
                    "error": "Payment not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if not request.data.get(
            "payment_proof"
        ):

            return Response(
                {
                    "payment_proof": [
                        "Payment proof image is required."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        payment.payment_proof = (
            request.data["payment_proof"]
        )

        payment.status = "authorized"

        payment.save(
            update_fields=[
                "payment_proof",
                "status",
                "updated_at"
            ]
        )

        if payment.booking_id:

            payment.booking.payment_status = (
                "pending_verification"
            )

            payment.booking.transaction_id = (
                payment.payment_reference
            )

            payment.booking.save(
                update_fields=[
                    "payment_status",
                    "transaction_id",
                    "updated_at"
                ]
            )

        return Response(
            {
                "message": (
                    "Payment proof submitted "
                    "for admin verification."
                ),
                "payment_reference": (
                    payment.payment_reference
                ),
            },
            status=status.HTTP_200_OK
        )

    # =========================================================
    # CREATE RENTAL PAYMENT
    # =========================================================

    @action(
        detail=False,
        methods=["post"],
        url_path="create-order"
    )
    def create_order(self, request):

        booking_id = request.data.get(
            "booking"
        )

        if not booking_id:

            return Response(
                {
                    "error": (
                        "Booking ID is required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

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
                    "error": (
                        "Payment already exists "
                        "for this booking."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        amount = booking.total_amount

        amount_in_paise = int(
            amount * 100
        )

        payment_reference = (
            f"UPK-R-{uuid4().hex[:12].upper()}"
        )

        payment = Payment.objects.create(
            booking=booking,
            user=request.user,
            amount=amount,
            payment_type="rental",
            payment_reference=payment_reference,
            status="created"
        )

        return Response(
            {
                "message": (
                    "Manual payment created "
                    "successfully."
                ),
                "payment_id": payment.id,
                "payment_reference": payment_reference,
                "amount": amount_in_paise,
                "currency": "INR",
            },
            status=status.HTTP_201_CREATED
        )

    # =========================================================
    # DEMO / DUMMY QR PAYMENT
    # =========================================================

    @action(
        detail=False,
        methods=["post"],
        url_path="demo-payment"
    )
    def demo_payment(self, request):

        booking_id = request.data.get(
            "booking"
        )

        if not booking_id:

            return Response(
                {
                    "error": (
                        "Booking ID is required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        from bookings.models import Booking

        # -----------------------------------------------------
        # Find booking belonging to logged-in user
        # -----------------------------------------------------

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

        # -----------------------------------------------------
        # Prevent duplicate payment
        # -----------------------------------------------------

        existing_payment = Payment.objects.filter(
            booking=booking
        ).first()

        if existing_payment:

            return Response(
                {
                    "error": (
                        "Payment already exists "
                        "for this booking."
                    ),
                    "payment_reference": (
                        existing_payment.payment_reference
                    ),
                    "payment_status": (
                        existing_payment.status
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -----------------------------------------------------
        # Get amount from database
        # -----------------------------------------------------

        amount = booking.total_amount

        if amount is None or amount <= 0:

            return Response(
                {
                    "error": (
                        "Invalid booking amount."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -----------------------------------------------------
        # Generate demo transaction reference
        # -----------------------------------------------------

        payment_reference = (
            f"DEMO-UPI-{uuid4().hex[:10].upper()}"
        )

        # -----------------------------------------------------
        # Create successful demo payment
        # -----------------------------------------------------

        payment = Payment.objects.create(
            booking=booking,
            user=request.user,
            amount=amount,
            payment_type="rental",
            payment_reference=payment_reference,
            status="captured",
            paid_at=timezone.now(),
        )

        # -----------------------------------------------------
        # Update booking
        # -----------------------------------------------------

        booking.payment_status = "paid"
        booking.transaction_id = payment_reference

        booking.save(
            update_fields=[
                "payment_status",
                "transaction_id",
                "updated_at",
            ]
        )

        # -----------------------------------------------------
        # Return response to React
        # -----------------------------------------------------

        return Response(
            {
                "success": True,
                "message": (
                    "Demo payment completed "
                    "successfully."
                ),
                "payment_id": payment.id,
                "payment_reference": payment_reference,
                "payment_status": payment.status,
                "amount": str(payment.amount),
                "currency": "INR",
            },
            status=status.HTTP_200_OK
        )