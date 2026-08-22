from django.db.models import Q

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Booking
from .serializers import BookingSerializer


class BookingViewSet(viewsets.ModelViewSet):

    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        # Admin can see everything
        if user.is_staff or user.role == "admin":
            return Booking.objects.all()

        # User's own bookings OR bookings for
        # equipment owned by the user
        return Booking.objects.filter(
            Q(user=user) |
            Q(equipment__owner=user)
        ).distinct()

    def perform_create(self, serializer):

        serializer.save(
            user=self.request.user
        )

    # ------------------------------------------------
    # CANCEL BOOKING
    # ------------------------------------------------

    @action(
        detail=True,
        methods=["post"]
    )
    def cancel(self, request, pk=None):

        booking = self.get_object()

        if booking.user != request.user:
            return Response(
                {
                    "detail": (
                        "You can only cancel your own booking."
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if booking.status not in [
            "pending",
            "approved"
        ]:
            return Response(
                {
                    "detail": (
                        "This booking cannot be cancelled."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = "cancelled"

        booking.save()

        return Response(
            BookingSerializer(
                booking,
                context={"request": request}
            ).data
        )

    # ------------------------------------------------
    # APPROVE BOOKING
    # ------------------------------------------------

    @action(
        detail=True,
        methods=["post"]
    )
    def approve(self, request, pk=None):

        booking = self.get_object()

        if booking.equipment.owner != request.user:
            return Response(
                {
                    "detail": (
                        "Only the equipment owner can "
                        "approve this booking."
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if booking.status != "pending":
            return Response(
                {
                    "detail": (
                        "Only pending bookings "
                        "can be approved."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = "approved"

        booking.save()

        return Response(
            BookingSerializer(
                booking,
                context={"request": request}
            ).data
        )

    # ------------------------------------------------
    # REJECT BOOKING
    # ------------------------------------------------

    @action(
        detail=True,
        methods=["post"]
    )
    def reject(self, request, pk=None):

        booking = self.get_object()

        if booking.equipment.owner != request.user:
            return Response(
                {
                    "detail": (
                        "Only the equipment owner can "
                        "reject this booking."
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if booking.status != "pending":
            return Response(
                {
                    "detail": (
                        "Only pending bookings "
                        "can be rejected."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = "rejected"

        booking.save()

        return Response(
            BookingSerializer(
                booking,
                context={"request": request}
            ).data
        )

    # ------------------------------------------------
    # COMPLETE BOOKING
    # ------------------------------------------------

    @action(
        detail=True,
        methods=["post"]
    )
    def complete(self, request, pk=None):

        booking = self.get_object()

        if booking.equipment.owner != request.user:
            return Response(
                {
                    "detail": (
                        "Only the equipment owner can "
                        "complete this booking."
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if booking.status != "approved":
            return Response(
                {
                    "detail": (
                        "Only approved bookings "
                        "can be completed."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = "completed"

        booking.save()

        return Response(
            BookingSerializer(
                booking,
                context={"request": request}
            ).data
        )