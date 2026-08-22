from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):

    ROLE_CHOICES = [
        ("farmer", "Farmer"),
        ("owner", "Equipment Owner"),
        ("dealer", "Dealer"),
        ("manufacturer", "Manufacturer"),
        ("admin", "Admin"),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="farmer"
    )

    phone = models.CharField(
        max_length=10,
        unique=True,
        blank=True,
        null=True
    )

    profile_picture = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True
    )

    email = models.EmailField(unique=True)

    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=10, blank=True)

    is_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username


class DealerProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="dealer_profile"
    )

    shop_name = models.CharField(max_length=200)
    shop_address = models.TextField()
    license_number = models.CharField(max_length=50)

    def __str__(self):
        return self.shop_name


class FarmerProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="farmer_profile"
    )

    land_area = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0
    )

    farming_type = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user.username} Farmer"


class OwnerProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="owner_profile"
    )

    total_equipments = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.user.username

class ManufacturerProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="manufacturer_profile"
    )

    company_name = models.CharField(max_length=200)
    company_logo = models.ImageField(
        upload_to="manufacturers/logos/",
        blank=True,
        null=True
    )
    company_banner = models.ImageField(
        upload_to="manufacturers/banners/",
        blank=True,
        null=True
    )
    gst_number = models.CharField(
        max_length=15,
        blank=True
    )
    website = models.URLField(
        blank=True
    )
    phone = models.CharField(
        max_length=10,
        blank=True
    )
    address = models.TextField(
        blank=True
    )
    description = models.TextField(
        blank=True
    )
    is_verified = models.BooleanField(
        default=False
    )

    def __str__(self):
        return self.company_name

