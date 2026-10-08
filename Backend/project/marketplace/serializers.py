from rest_framework import serializers
from django.db.models import Avg

from .models import Category, Equipment, EquipmentImage, Wishlist


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
    images = serializers.SerializerMethodField()
    additional_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
    )

    def validate_video(self, value):
        if value and not (value.content_type or "").startswith("video/"):
            raise serializers.ValidationError("Upload a valid video file.")
        return value

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
            "images",
            "additional_images",
            "video",
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

        return round(average, 1) if average is not None else 4.5

    def get_images(self, obj):
        image_files = []
        if obj.image:
            image_files.append(obj.image)
        if obj.image_url:
            image_files.append(obj.image_url)
        image_files.extend(
            photo.image for photo in obj.additional_images.all()
        )

        request = self.context.get("request")
        image_urls = []
        for image in image_files:
            url = image if isinstance(image, str) else image.url
            if request and not url.startswith(("http://", "https://")):
                url = request.build_absolute_uri(url)
            image_urls.append(url)
        return image_urls

    def get_owner_name(self, obj):
        if obj.owner.role == "dealer":
            dealer_profile = getattr(obj.owner, "dealer_profile", None)
            if dealer_profile and dealer_profile.shop_name:
                return dealer_profile.shop_name

        return obj.owner.get_full_name() or obj.owner.username

    def create(self, validated_data):
        category_label = validated_data.pop("category_label", None)
        additional_images = validated_data.pop("additional_images", [])
        if category_label and not validated_data.get("category"):
            category, _ = Category.objects.get_or_create(name=category_label)
            validated_data["category"] = category
        if additional_images and not validated_data.get("image"):
            validated_data["image"] = additional_images.pop(0)

        equipment = super().create(validated_data)
        for image in additional_images:
            EquipmentImage.objects.create(equipment=equipment, image=image)
        return equipment

    def update(self, instance, validated_data):
        category_label = validated_data.pop("category_label", None)
        additional_images = validated_data.pop("additional_images", [])
        if category_label:
            category, _ = Category.objects.get_or_create(name=category_label)
            validated_data["category"] = category
        equipment = super().update(instance, validated_data)
        for image in additional_images:
            EquipmentImage.objects.create(equipment=equipment, image=image)
        return equipment


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