from rest_framework import serializers

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment

        fields = [
            "id",
            "booking",
            "user",
            "amount",
            "razorpay_order_id",
            "razorpay_payment_id",
            "razorpay_signature",
            "status",
            "created_at",
            "updated_at",
            "paid_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "amount",
            "razorpay_order_id",
            "razorpay_payment_id",
            "razorpay_signature",
            "status",
            "created_at",
            "updated_at",
            "paid_at",
        ]