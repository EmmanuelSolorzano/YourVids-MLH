from django_filters import rest_framework as filters
from .models import Video


# We create filters for each field we want to be able to filter on
class VideoFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')
    creator__username = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Video
        fields = ['title', 'creator__username']