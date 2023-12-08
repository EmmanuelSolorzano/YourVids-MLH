from django.urls import path
from . import views


urlpatterns = [
    path('', views.ListCreateVideoAPIView.as_view(), name='get_post_videos'),
    path('all/', views.ListAllVideosAPIView.as_view(), name='get_all_videos'),
    path('list/', views.ListVideosAPIView.as_view(), name='get_videos'),
    path('list/<int:pk>/', views.RetrieveVideoAPIView.as_view(), name='get_video'),
    path('<int:pk>/', views.RetrieveUpdateDestroyVideoAPIView.as_view(), name='get_delete_update_video'),
    path('num/', views.NumVideosAPIView.as_view(), name='get_num_videos'),
    path('comments/<int:video_id>/', views.ListCommentsAPIView.as_view(), name='list_comments'),
    path('comments/create/', views.ListCreateCommentAPIView.as_view(), name='create_comment'),
    path('comments/delete/<int:pk>/', views.RetrieveUpdateDestroyCommentAPIView.as_view(), name='update_comment'),
    path('likes/<int:pk>/', views.VideoLikeToggleView.as_view(), name='video-like-toggle'),
    path('dislikes/<int:pk>/', views.VideoDislikeToggleView.as_view(), name='video-dislike-toggle'),
    path('views/<int:pk>/', views.IncrementVideoViewsAPIView.as_view(), name='increment-video-views'),
]