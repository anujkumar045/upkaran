from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    user_profile_picture = serializers.ImageField(
        source="user.profile_picture",
        read_only=True
    )

    equipment_name = serializers.CharField(
        source="equipment.name",
        read_only=True
    )

    class Meta:
        model = Review

        fields = [
            "id",
            "equipment",
            "equipment_name",
            "user",
            "username",
            "user_profile_picture",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "user",
            "username",
            "user_profile_picture",
            "created_at",
            "updated_at",
        ]

    def validate_rating(self, value):

        if value < 1 or value > 5:
            raise serializers.ValidationError(
                "Rating must be between 1 and 5."
            )

        return value

    def validate(self, attrs):

        request = self.context["request"]
        user = request.user
        equipment = attrs["equipment"]

        if equipment.owner == user:
            raise serializers.ValidationError(
                "Equipment owners cannot review their own equipment."
            )

        return attrs

    def create(self, validated_data):

        return Review.objects.create(
            user=self.context["request"].user,
            **validated_data
        )