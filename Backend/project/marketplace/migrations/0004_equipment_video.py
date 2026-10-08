from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("marketplace", "0003_equipment_image_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="equipment",
            name="video",
            field=models.FileField(
                blank=True,
                null=True,
                upload_to="equipment_videos/",
            ),
        ),
    ]
