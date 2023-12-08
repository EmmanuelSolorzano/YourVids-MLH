from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Video

@csrf_exempt
def upload_video(request):
    if request.method == 'POST':
        video_file = request.FILES.get('video_file')
        if video_file:
            video = Video.objects.create(video_file=video_file)
            return JsonResponse({'message': 'File uploaded successfully', 'video_id': video.id})
        else:
            return JsonResponse({'error': 'No file provided'})

from PIL import Image
import os
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from moviepy.video.io.VideoFileClip import VideoFileClip


@receiver(post_save, sender=Video)
def create_thumbnail(sender, instance, created, **kwargs):
    if created:
        process_thumbnail(instance)

def process_thumbnail(instance, **kwargs):
    if instance.video_file:
        video_filename = os.path.basename(instance.video_file.path)
        video_path = os.path.join(settings.MEDIA_ROOT, 'videos', video_filename)

        thumbnail_filename = os.path.basename(instance.thumbnail.path)
        thumbnail_path = os.path.join(settings.MEDIA_ROOT, 'thumbnails', thumbnail_filename)

        if not os.path.exists(video_path):
            raise ValueError(f"The video file '{video_path}' does not exist.")

        clip = VideoFileClip(video_path)
        frame = clip.get_frame(1)

        desired_width = 254
        desired_height = 194
        thumbnail_image = Image.fromarray(frame)
        thumbnail_image = thumbnail_image.resize((desired_width, desired_height), resample=Image.LANCZOS)

        thumbnail_image.save(thumbnail_path, 'JPEG')

        relative_thumbnail_path = thumbnail_path.replace(settings.MEDIA_ROOT, '').replace(os.path.sep, '/')
        instance.thumbnail = relative_thumbnail_path
