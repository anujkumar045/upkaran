from django.db.models import Sum, Avg

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from bookings.models import Booking
from marketplace.models import Equipment, Wishlist
from accounts.models import User


# =========================================================
# FARMER DASHBOARD
# =========================================================

class FarmerDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "farmer":
            return Response(
                {"error": "Only farmers can access this dashboard."},
                status=403
            )

        user = request.user

        bookings = Booking.objects.filter(
            user=user
        )

        total_bookings = bookings.count()

        active_bookings = bookings.filter(
            status__in=["pending", "approved"]
        ).count()

        completed_bookings = bookings.filter(
            status="completed"
        ).count()

        cancelled_bookings = bookings.filter(
            status="cancelled"
        ).count()

        wishlist_count = Wishlist.objects.filter(
            user=user
        ).count()

        total_spent = bookings.filter(
            status="completed"
        ).aggregate(
            total=Sum("total_price")
        )["total"] or 0

        return Response({
            "role": "farmer",

            "total_bookings": total_bookings,
            "active_bookings": active_bookings,
            "completed_bookings": completed_bookings,
            "cancelled_bookings": cancelled_bookings,

            "wishlist_count": wishlist_count,

            "total_spent": total_spent,
        })


# =========================================================
# OWNER DASHBOARD
# =========================================================

class OwnerDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "owner":
            return Response(
                {
                    "error":
                    "Only equipment owners can access this dashboard."
                },
                status=403
            )

        user = request.user

        equipments = Equipment.objects.filter(
            owner=user
        )

        bookings = Booking.objects.filter(
            equipment__owner=user
        )

        total_equipments = equipments.count()

        available_equipments = equipments.filter(
            is_available=True
        ).count()

        unavailable_equipments = equipments.filter(
            is_available=False
        ).count()

        total_bookings = bookings.count()

        pending_bookings = bookings.filter(
            status="pending"
        ).count()

        approved_bookings = bookings.filter(
            status="approved"
        ).count()

        completed_bookings = bookings.filter(
            status="completed"
        ).count()

        cancelled_bookings = bookings.filter(
            status="cancelled"
        ).count()

        total_earnings = bookings.filter(
            status="completed"
        ).aggregate(
            total=Sum("total_price")
        )["total"] or 0

        return Response({
            "role": "owner",

            "total_equipments": total_equipments,
            "available_equipments": available_equipments,
            "unavailable_equipments": unavailable_equipments,

            "total_bookings": total_bookings,
            "pending_bookings": pending_bookings,
            "approved_bookings": approved_bookings,
            "completed_bookings": completed_bookings,
            "cancelled_bookings": cancelled_bookings,

            "total_earnings": total_earnings,
        })


# =========================================================
# DEALER DASHBOARD
# =========================================================

class DealerDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "dealer":
            return Response(
                {
                    "error":
                    "Only dealers can access this dashboard."
                },
                status=403
            )

        user = request.user

        equipments = Equipment.objects.filter(
            owner=user
        )

        bookings = Booking.objects.filter(
            equipment__owner=user
        )

        total_equipments = equipments.count()

        available_equipments = equipments.filter(
            is_available=True
        ).count()

        total_bookings = bookings.count()

        pending_bookings = bookings.filter(
            status="pending"
        ).count()

        completed_bookings = bookings.filter(
            status="completed"
        ).count()

        total_earnings = bookings.filter(
            status="completed"
        ).aggregate(
            total=Sum("total_price")
        )["total"] or 0

        return Response({
            "role": "dealer",

            "total_equipments": total_equipments,
            "available_equipments": available_equipments,

            "total_bookings": total_bookings,
            "pending_bookings": pending_bookings,
            "completed_bookings": completed_bookings,

            "total_earnings": total_earnings,
        })


# =========================================================
# MANUFACTURER DASHBOARD
# =========================================================

class ManufacturerDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "manufacturer":
            return Response(
                {
                    "error":
                    "Only manufacturers can access this dashboard."
                },
                status=403
            )

        user = request.user

        # Equipment/products owned by manufacturer
        equipments = Equipment.objects.filter(
            owner=user
        )

        total_products = equipments.count()

        available_products = equipments.filter(
            is_available=True
        ).count()

        # Reviews
        total_reviews = 0
        average_rating = 0

        try:

            total_reviews = sum(
                equipment.reviews.count()
                for equipment in equipments
            )

            ratings = []

            for equipment in equipments:

                ratings_queryset = equipment.reviews.values_list(
                    "rating",
                    flat=True
                )

                ratings.extend(
                    ratings_queryset
                )

            if ratings:
                average_rating = round(
                    sum(ratings) / len(ratings),
                    2
                )

        except Exception:
            pass

        return Response({
            "role": "manufacturer",

            "total_products": total_products,
            "available_products": available_products,

            "total_reviews": total_reviews,
            "average_rating": average_rating,
        })


# =========================================================
# ADMIN DASHBOARD
# =========================================================

class AdminDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if not (
            request.user.is_staff
            or request.user.role == "admin"
        ):
            return Response(
                {
                    "error":
                    "Only admins can access this dashboard."
                },
                status=403
            )

        total_users = User.objects.count()

        total_farmers = User.objects.filter(
            role="farmer"
        ).count()

        total_owners = User.objects.filter(
            role="owner"
        ).count()

        total_dealers = User.objects.filter(
            role="dealer"
        ).count()

        total_manufacturers = User.objects.filter(
            role="manufacturer"
        ).count()

        total_equipments = Equipment.objects.count()

        total_bookings = Booking.objects.count()

        completed_bookings = Booking.objects.filter(
            status="completed"
        ).count()

        total_revenue = Booking.objects.filter(
            status="completed"
        ).aggregate(
            total=Sum("total_price")
        )["total"] or 0

        return Response({
            "role": "admin",

            "users": {
                "total": total_users,
                "farmers": total_farmers,
                "owners": total_owners,
                "dealers": total_dealers,
                "manufacturers": total_manufacturers,
            },

            "equipment": {
                "total": total_equipments,
            },

            "bookings": {
                "total": total_bookings,
                "completed": completed_bookings,
            },

            "revenue": {
                "total": total_revenue,
            },
        })