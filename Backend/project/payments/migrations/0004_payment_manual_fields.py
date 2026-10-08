from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("payments", "0003_payment_razorpay_qr_fields"),
    ]

    operations = [
        migrations.AlterField(
            model_name="payment",
            name="razorpay_order_id",
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
        migrations.AddField(
            model_name="payment",
            name="payment_reference",
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
        migrations.AddField(
            model_name="payment",
            name="payment_proof",
            field=models.ImageField(blank=True, null=True, upload_to="payments/proofs/"),
        ),
    ]