from django.db import models
from django.conf import settings


class Review(models.Model):

    equipment = models.ForeignKey(
        "marketplace.Equipment",
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    rating = models.PositiveIntegerField()

    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["equipment", "user"],
                name="unique_equipment_review_per_user"
            )
        ]

    def __str__(self):
        return f"{self.equipment.name} - {self.user.username} - {self.rating}"