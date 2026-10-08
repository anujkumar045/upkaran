from rest_framework import serializers

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):

    buyer_name = serializers.SerializerMethodField()
    buyer_email = serializers.CharField(
        source="user.email",
        read_only=True
    )
    buyer_phone = serializers.CharField(
        source="user.phone",
        read_only=True
    )
    buyer_role = serializers.CharField(
        source="user.role",
        read_only=True
    )

    equipment_name = serializers.CharField(
        source="equipment.name",
        read_only=True
    )

    seller_name = serializers.SerializerMethodField()
    seller_email = serializers.SerializerMethodField()
    seller_role = serializers.SerializerMethodField()

    def get_buyer_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    def get_seller_name(self, obj):
        if not obj.equipment:
            return "-"

        owner = obj.equipment.owner

        if owner.role == "dealer" and hasattr(
            owner,
            "dealer_profile"
        ):
            return owner.dealer_profile.shop_name

        return owner.get_full_name() or owner.username

    def get_seller_email(self, obj):
        return (
            obj.equipment.owner.email
            if obj.equipment
            else "-"
        )

    def get_seller_role(self, obj):
        return (
            obj.equipment.owner.role
            if obj.equipment
            else "-"
        )

    class Meta:
        model = Payment

        fields = [
            "id",
            "booking",
            "equipment",
            "equipment_name",
            "payment_type",
            "user",
            "buyer_name",
            "buyer_email",
            "buyer_phone",
            "buyer_role",
            "seller_name",
            "seller_email",
            "seller_role",
            "amount",
            "razorpay_order_id",
            "payment_reference",
            "payment_proof",
            "razorpay_qr_id",
            "razorpay_qr_image_url",
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
            "equipment",
            "payment_type",
            "amount",
            "razorpay_order_id",
            "payment_reference",
            "payment_proof",
            "razorpay_qr_id",
            "razorpay_qr_image_url",
            "razorpay_payment_id",
            "razorpay_signature",
            "status",
            "created_at",
            "updated_at",
            "paid_at",
        ]