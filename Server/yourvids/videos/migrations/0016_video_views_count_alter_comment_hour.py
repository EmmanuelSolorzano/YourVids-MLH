# Generated by Django 4.2.4 on 2023-12-03 20:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('videos', '0015_alter_comment_hour_alter_video_updated_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='views_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='comment',
            name='hour',
            field=models.TimeField(default='20:41'),
        ),
    ]
