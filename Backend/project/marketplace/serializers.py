from rest_framework import serializers
from django.db.models import Avg

from .models import Category, Equipment, Wishlist


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class EquipmentSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    owner_name = serializers.SerializerMethodField()
    owner_phone = serializers.ReadOnlyField(source="owner.phone")
    category_name = serializers.ReadOnlyField(source="category.name")
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        required=False,
        allow_null=True
    )
    category_label = serializers.CharField(write_only=True, required=False)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Equipment
        fields = [
            "id",
            "owner",
            "owner_name",
            "owner_phone",
            "category",
            "category_name",
            "category_label",
            "name",
            "brand",
            "description",
            "price",
            "rental_price",
            "condition",
            "location",
            "image",
            "image_url",
            "quantity",
            "is_available",
            "average_rating",
            "created_at",
            "updated_at",
        ]

    def get_average_rating(self, obj):
        average = obj.reviews.aggregate(
            Avg("rating")
        )["rating__avg"]

        return round(average, 1) if average else 0

    def get_owner_name(self, obj):
        if obj.owner.role == "dealer":
            dealer_profile = getattr(obj.owner, "dealer_profile", None)
            if dealer_profile and dealer_profile.shop_name:
                return dealer_profile.shop_name

        return obj.owner.get_full_name() or obj.owner.username

    def create(self, validated_data):
        category_label = validated_data.pop("category_label", None)
        if category_label and not validated_data.get("category"):
            category, _ = Category.objects.get_or_create(name=category_label)
            validated_data["category"] = category
        return super().create(validated_data)

    def update(self, instance, validated_data):
        category_label = validated_data.pop("category_label", None)
        if category_label:
            category, _ = Category.objects.get_or_create(name=category_label)
            validated_data["category"] = category
        return super().update(instance, validated_data)


class WishlistSerializer(serializers.ModelSerializer):
    equipment_details = EquipmentSerializer(
        source="equipment",
        read_only=True
    )

    class Meta:
        model = Wishlist
        fields = [
            "id",
            "equipment",
            "equipment_details",
            "created_at",
        ]