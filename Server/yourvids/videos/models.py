from django.db import models
from datetime import datetime

class Video(models.Model):
    title = models.CharField(max_length=100, blank=False)
    description = models.CharField(max_length=1000, blank=False, default="")
    updated_at = models.DateTimeField(auto_now_add=True, editable=False)
    creator = models.ForeignKey('auth.User', related_name='movies', on_delete=models.CASCADE)
    video_file = models.FileField(upload_to='videos/')
    thumbnail = models.ImageField(upload_to='thumbnails/')
    likes = models.ManyToManyField('auth.User', related_name='liked_videos', blank=True)  
    dislikes = models.ManyToManyField('auth.User', related_name='disliked_videos', blank=True)    
    views_count = models.IntegerField(default=0)
    listed = models.BooleanField(default= True)

    class Meta:
        ordering = ['-updated_at']

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.updated_at = datetime.now()
        super(Video, self).save(*args, **kwargs)

class Comment(models.Model):
    creator = models.TextField(max_length=100)
    date = models.DateField(auto_now_add=True)
    hour = models.TimeField(default=datetime.now().strftime('%H:%M'))
    message = models.TextField(max_length=100)
    video = models.ForeignKey('Video', related_name='comments', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.creator} - {self.date} {self.hour}'