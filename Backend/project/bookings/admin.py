from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "user",
        "equipment",
        "start_date",
        "end_date",
        "total_amount",
        "status",
        "payment_status",
        "booked_at",
    ]

    list_filter = [
        "status",
        "payment_status",
        "start_date",
        "end_date",
    ]

    search_fields = [
        "user__username",
        "equipment__name",
        "transaction_id",
    ]

    readonly_fields = [
        "booked_at",
        "updated_at",
    ]