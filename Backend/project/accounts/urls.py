from django.urls import path

from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    ProfileCompletionView,
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