# Generated by Django 4.2.4 on 2023-12-04 01:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('videos', '0016_video_views_count_alter_comment_hour'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='description',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='comment',
            name='hour',
            field=models.TimeField(default='01:23'),
        ),
    ]
