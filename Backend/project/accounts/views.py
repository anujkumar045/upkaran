from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password, make_password
from django.conf import settings
from django.core.mail import EmailMessage
from django.utils import timezone
from django.db.models import Q

import secrets
from datetime import timedelta

from .models import *

from .serializers import LoginTokenSerializer
from .serializers import *


class LoginTokenView(TokenObtainPairView):
    serializer_class = LoginTokenSerializer


# =====================================================
# REGISTER
# =====================================================

class RegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        print("REGISTER DATA:", request.data)

        serializer = RegisterSerializer(
            data=request.data
        )

        if serializer.is_valid():

            user = serializer.save()

            return Response(
                {
                    "message": "Registration successful.",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "phone": user.phone,
                        "role": user.role,
                        "city": user.city,
                        "profile_picture": user.profile_picture.url if user.profile_picture else None,
                    }
                },
                status=status.HTTP_201_CREATED
            )

        print(
            "REGISTER ERRORS:",
            serializer.errors
        )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# =====================================================
# LOGIN
# =====================================================

class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:

            return Response(
                {
                    "detail":
                    "Username and password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            account = User.objects.get(
                Q(username=username) |
                Q(phone=username) |
                Q(email__iexact=username)
            )
        except User.DoesNotExist:
            account = None

        user = authenticate(
            username=account.username if account else username,
            password=password
        )

        if user is None:

            return Response(
                {
                    "detail":
                    "Invalid username or password."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:

            return Response(
                {
                    "detail":
                    "This account is inactive."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Create JWT
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful.",

                "access": str(
                    refresh.access_token
                ),

                "refresh": str(refresh),

                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "phone": user.phone,
                    "role": user.role,
                    "city": user.city,
                    "state": user.state,
                    "pincode": user.pincode,
                    "is_verified": user.is_verified,
                    "profile_picture": user.profile_picture.url if user.profile_picture else None,
                }
            },
            status=status.HTTP_200_OK
        )


# =====================================================
# PROFILE
# =====================================================

class ProfileView(APIView):

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):

        serializer = UserSerializer(
            request.user
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def patch(self, request):

        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# =====================================================
# PROFILE COMPLETION
# =====================================================

class ProfileCompletionView(APIView):

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):

        user = request.user

        role = user.role

        print(
            "PROFILE DATA:",
            request.data
        )

        # -------------------------------------------------
        # FARMER
        # -------------------------------------------------

        if role == "farmer":

            profile, created = (
                FarmerProfile.objects.get_or_create(
                    user=user
                )
            )

            serializer = FarmerProfileSerializer(
                profile,
                data=request.data,
                partial=True
            )

        # -------------------------------------------------
        # OWNER
        # -------------------------------------------------

        elif role == "owner":

            profile, created = (
                OwnerProfile.objects.get_or_create(
                    user=user
                )
            )

            serializer = OwnerProfileSerializer(
                profile,
                data=request.data,
                partial=True
            )

        # -------------------------------------------------
        # DEALER
        # -------------------------------------------------

        elif role == "dealer":

            profile, created = (
                DealerProfile.objects.get_or_create(
                    user=user
                )
            )

            serializer = DealerProfileSerializer(
                profile,
                data=request.data,
                partial=True
            )

        # -------------------------------------------------
        # MANUFACTURER
        # -------------------------------------------------

        elif role == "manufacturer":

            profile, created = (
                ManufacturerProfile.objects.get_or_create(
                    user=user
                )
            )

            serializer = ManufacturerProfileSerializer(
                profile,
                data=request.data,
                partial=True
            )

        else:

            return Response(
                {
                    "detail":
                    "Invalid user role."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # VALIDATE
        # -------------------------------------------------

        if serializer.is_valid():

            serializer.save()

            return Response(
                {
                    "message":
                    "Profile completed successfully.",

                    "role": role,

                    "profile":
                    serializer.data
                },
                status=status.HTTP_200_OK
            )

        print(
            "PROFILE ERRORS:",
            serializer.errors
        )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class PasswordResetRequestView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()

        if not email:
            return Response(
                {"email": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(email__iexact=email).first()
        if user is None:
            return Response(
                {"detail": "No account is registered with this email."},
                status=status.HTTP_404_NOT_FOUND
            )

        otp = f"{secrets.randbelow(1_000_000):06d}"
        PasswordResetOTP.objects.filter(
            user=user,
            is_used=False
        ).update(is_used=True)
        PasswordResetOTP.objects.create(
            user=user,
            otp_hash=make_password(otp),
            expires_at=timezone.now() + timedelta(minutes=10)
        )

        message = EmailMessage(
            subject="Upkaran password reset OTP",
            body=(
                f"Your Upkaran password reset OTP is {otp}. "
                "It expires in 10 minutes."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email]
        )

        try:
            message.send(fail_silently=False)
        except Exception:
            PasswordResetOTP.objects.filter(
                user=user,
                is_used=False
            ).update(is_used=True)
            return Response(
                {"detail": "Unable to send the OTP email. Please try again later."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        return Response(
            {"message": "OTP sent to your registered email address."},
            status=status.HTTP_200_OK
        )


class PasswordResetConfirmView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        otp = str(request.data.get("otp", "")).strip()
        new_password = request.data.get("new_password", "")

        if not email or len(otp) != 6 or not otp.isdigit() or not new_password:
            return Response(
                {"detail": "Email, a 6-digit OTP, and a new password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(email__iexact=email).first()
        reset_otp = PasswordResetOTP.objects.filter(
            user=user,
            is_used=False
        ).order_by("-created_at").first() if user else None

        if (
            reset_otp is None
            or reset_otp.expires_at <= timezone.now()
            or not check_password(otp, reset_otp.otp_hash)
        ):
            return Response(
                {"detail": "Invalid or expired OTP."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save(update_fields=["password"])
        reset_otp.is_used = True
        reset_otp.save(update_fields=["is_used"])

        return Response(
            {"message": "Password reset successful."},
            status=status.HTTP_200_OK
        )