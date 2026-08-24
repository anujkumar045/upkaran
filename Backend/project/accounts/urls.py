from django.urls import path

from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    ProfileCompletionView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
)

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [

    # Register
    path(
        "register/",
        RegisterView.as_view(),
        name="register"
    ),

    # Login
    path(
        "login/",
        LoginView.as_view(),
        name="login"
    ),

    path(
        "password-reset/request/",
        PasswordResetRequestView.as_view(),
        name="password-reset-request"
    ),

    path(
        "password-reset/confirm/",
        PasswordResetConfirmView.as_view(),
        name="password-reset-confirm"
    ),

    # Refresh JWT token
    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh"
    ),

    # Logged-in user's basic profile
    path(
        "profile/",
        ProfileView.as_view(),
        name="profile"
    ),

    # Role-based profile completion
    path(
        "profile/complete/",
        ProfileCompletionView.as_view(),
        name="profile-complete"
    ),
]