from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import (
    DealerProfile,
    FarmerProfile,
    ManufacturerProfile,
    OwnerProfile,
)

User = get_user_model()


class LoginTokenSerializer(TokenObtainPairSerializer):
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(required=False)

    def validate(self, attrs):
        identifier = (
            attrs.get("username")
            or attrs.get("email")
            or attrs.get("phone")
        )

        if identifier:
            account = User.objects.filter(username=identifier).first()
            if account is None:
                account = User.objects.filter(
                    email__iexact=identifier
                ).first()
            if account is None:
                account = User.objects.filter(phone=identifier).first()
            attrs["username"] = account.username if account else identifier

        return super().validate(attrs)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone",
            "role",
            "profile_picture",
            "address",
            "city",
            "state",
            "state",
            "pincode",
            "is_verified",
        ]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "phone",
            "password",
            "role",
            "first_name",
            "last_name",
            "city",
            "profile_picture",
        ]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class ManufacturerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManufacturerProfile
        fields = "__all__"


class DealerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DealerProfile
        fields = "__all__"


class OwnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwnerProfile
        fields = "__all__"


class FarmerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmerProfile
        fields = "__all__"