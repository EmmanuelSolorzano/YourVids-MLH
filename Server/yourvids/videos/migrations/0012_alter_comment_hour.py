# Generated by Django 4.2.4 on 2023-12-02 16:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('videos', '0011_alter_comment_hour'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='hour',
            field=models.TimeField(default='16:22'),
        ),
    ]
