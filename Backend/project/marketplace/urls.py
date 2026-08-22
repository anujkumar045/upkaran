from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet,
    EquipmentViewSet,
    WishlistViewSet,
)

router = DefaultRouter()

router.register(
    "categories",
    CategoryViewSet,
    basename="category"
)

router.register(
    "equipments",
    EquipmentViewSet,
    basename="equipment"
)

router.register(
    "wishlist",
    WishlistViewSet,
    basename="wishlist"
)

urlpatterns = [
    path("", include(router.urls)),
]