from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('marketplace', '0002_alter_equipment_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='equipment',
            name='image_url',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
    ]
