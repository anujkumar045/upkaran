from django.db import models
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to="categories/", blank=True, null=True)

    def __str__(self):
        return self.name


class Equipment(models.Model):

    CONDITION_CHOICES = [
        ("new", "New"),
        ("used", "Used"),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="equipments"
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="equipments"
    )

    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=100)

    description = models.TextField()

    price = models.DecimalField(max_digits=10, decimal_places=2)

    rental_price = models.DecimalField(max_digits=10, decimal_places=2)

    condition = models.CharField(
        max_length=10,
        choices=CONDITION_CHOICES
    )

    location = models.CharField(max_length=200)

    image = models.ImageField(upload_to="equipments/", blank=True, null=True)

    image_url = models.URLField(max_length=500, blank=True, null=True)

    quantity = models.PositiveIntegerField(default=1)

    is_available = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Wishlist(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "equipment")