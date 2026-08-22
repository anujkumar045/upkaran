from django.urls import path

from .views import (
    FarmerDashboardView,
    OwnerDashboardView,
    DealerDashboardView,
    ManufacturerDashboardView,
    AdminDashboardView,
)


urlpatterns = [

    path(
        "farmer/",
        FarmerDashboardView.as_view(),
        name="farmer-dashboard"
    ),

    path(
        "owner/",
        OwnerDashboardView.as_view(),
        name="owner-dashboard"
    ),

    path(
        "dealer/",
        DealerDashboardView.as_view(),
        name="dealer-dashboard"
    ),

    path(
        "manufacturer/",
        ManufacturerDashboardView.as_view(),
        name="manufacturer-dashboard"
    ),

    path(
        "admin/",
        AdminDashboardView.as_view(),
        name="admin-dashboard"
    ),
]