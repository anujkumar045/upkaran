from django.db import models
from django.conf import settings


class Payment(models.Model):

    STATUS_CHOICES = [
        ("created", "Created"),
        ("authorized", "Authorized"),
        ("captured", "Captured"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    ]

    booking = models.OneToOneField(
        "bookings.Booking",
        on_delete=models.CASCADE,
        related_name="payment",
        blank=True,
        null=True
    )

    equipment = models.ForeignKey(
        "marketplace.Equipment",
        on_delete=models.SET_NULL,
        related_name="payments",
        blank=True,
        null=True
    )

    payment_type = models.CharField(
        max_length=20,
        choices=[("rental", "Rental"), ("purchase", "Purchase")],
        default="rental"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    razorpay_order_id = models.CharField(
        max_length=100,
        unique=True
    )

    razorpay_qr_id = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    razorpay_qr_image_url = models.URLField(
        blank=True,
        null=True
    )

    razorpay_payment_id = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    razorpay_signature = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="created"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    paid_at = models.DateTimeField(
        blank=True,
        null=True
    )

    def __str__(self):
        reference = self.booking_id or self.equipment_id
        return f"Payment #{self.id} - Reference #{reference}"