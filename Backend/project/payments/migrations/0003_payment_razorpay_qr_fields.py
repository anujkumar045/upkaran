from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("payments", "0002_payment_equipment_payment_payment_type_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="payment",
            name="razorpay_qr_id",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name="payment",
            name="razorpay_qr_image_url",
            field=models.URLField(blank=True, null=True),
        ),
    ]