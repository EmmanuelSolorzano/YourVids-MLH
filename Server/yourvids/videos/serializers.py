from rest_framework import serializers
from .models import Video
from django.contrib.auth.models import User
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = '__all__'

class VideoSerializer(serializers.ModelSerializer):
    creator = serializers.ReadOnlyField(source='creator.username')

    class Meta:
        model = Video
        fields = ('id', 'title', 'description', 'updated_at', 'video_file', 'thumbnail' ,'creator', 'likes', 'dislikes', 'views_count', 'listed')

class UserSerializer(serializers.ModelSerializer):
    videos = serializers.PrimaryKeyRelatedField(many=True, queryset=Video.objects.all())

    class Meta:
        model = User
        fields = ('id', 'username', 'videos')
