from decimal import Decimal

from django.utils import timezone
from django.db.models import Q

from rest_framework import serializers

from .models import Booking
from marketplace.models import Equipment


class BookingSerializer(serializers.ModelSerializer):

    equipment_name = serializers.CharField(
        source="equipment.name",
        read_only=True
    )

    equipment_image = serializers.ImageField(
        source="equipment.image",
        read_only=True
    )

    owner_name = serializers.CharField(
        source="equipment.owner.username",
        read_only=True
    )

    user_name = serializers.CharField(
        source="user.username",
        read_only=True
    )

    user_phone = serializers.CharField(
        source="user.phone",
        read_only=True
    )

    class Meta:
        model = Booking

        fields = [
            "id",
            "user",
            "user_name",
            "user_phone",
            "equipment",
            "equipment_name",
            "equipment_image",
            "owner_name",
            "start_date",
            "end_date",
            "total_days",
            "daily_rate",
            "subtotal",
            "tax",
            "platform_fee",
            "total_amount",
            "status",
            "payment_status",
            "transaction_id",
            "booked_at",
            "updated_at",
        ]

        read_only_fields = [
            "user",
            "total_days",
            "daily_rate",
            "subtotal",
            "tax",
            "platform_fee",
            "total_amount",
            "status",
            "payment_status",
            "booked_at",
            "updated_at",
        ]

    def validate(self, attrs):

        equipment = attrs["equipment"]

        start_date = attrs["start_date"]
        end_date = attrs["end_date"]

        today = timezone.localdate()

        # Start date cannot be in the past
        if start_date < today:
            raise serializers.ValidationError(
                {
                    "start_date": "Start date cannot be in the past."
                }
            )

        # End date must be after or equal to start date
        if end_date < start_date:
            raise serializers.ValidationError(
                {
                    "end_date": "End date must be after start date."
                }
            )

        # Equipment must be available
        if not equipment.is_available:
            raise serializers.ValidationError(
                {
                    "equipment": "This equipment is currently unavailable."
                }
            )

        # Equipment owner cannot book their own equipment
        if self.context["request"].user == equipment.owner:
            raise serializers.ValidationError(
                {
                    "equipment": "You cannot book your own equipment."
                }
            )

        # Check overlapping bookings
        overlapping_booking = Booking.objects.filter(
            equipment=equipment,
            start_date__lte=end_date,
            end_date__gte=start_date,
            status__in=["pending", "approved"]
        ).exists()

        if overlapping_booking:
            raise serializers.ValidationError(
                {
                    "equipment": (
                        "This equipment is already booked "
                        "for the selected dates."
                    )
                }
            )

        return attrs

    def create(self, validated_data):

        equipment = validated_data["equipment"]

        start_date = validated_data["start_date"]
        end_date = validated_data["end_date"]

        total_days = (
            end_date - start_date
        ).days + 1

        daily_rate = equipment.rental_price

        subtotal = (
            daily_rate * total_days
        )

        # Example: 5% platform fee
        platform_fee = (
            subtotal * Decimal("0.05")
        )

        # Example: 18% GST on subtotal + platform fee
        tax = (
            (subtotal + platform_fee)
            * Decimal("0.18")
        )

        total_amount = (
            subtotal
            + platform_fee
            + tax
        )

        booking = Booking.objects.create(
            user=self.context["request"].user,
            equipment=equipment,
            start_date=start_date,
            end_date=end_date,
            total_days=total_days,
            daily_rate=daily_rate,
            subtotal=subtotal,
            platform_fee=platform_fee,
            tax=tax,
            total_amount=total_amount,
        )

        return booking