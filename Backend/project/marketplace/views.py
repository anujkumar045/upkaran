from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Category, Equipment, Wishlist
from .serializers import (
    CategorySerializer,
    EquipmentSerializer,
    WishlistSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = [
        "category",
        "condition",
        "brand",
        "location",
        "is_available",
    ]

    search_fields = [
        "name",
        "brand",
        "description",
    ]

    ordering_fields = [
        "price",
        "created_at",
        "rental_price",
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.owner_id != self.request.user.id:
            raise PermissionDenied("You can only edit your own equipment.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.owner_id != self.request.user.id:
            raise PermissionDenied("You can only delete your own equipment.")
        instance.delete()

    def get_queryset(self):
        queryset = Equipment.objects.select_related(
            "category",
            "owner",
        ).prefetch_related("additional_images")

        if self.request.query_params.get("mine") == "true":
            if not self.request.user.is_authenticated:
                return queryset.none()
            return queryset.filter(owner=self.request.user)

        return queryset


class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer

    def get_queryset(self):
        return Wishlist.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)