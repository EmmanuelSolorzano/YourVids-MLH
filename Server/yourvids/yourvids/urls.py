
from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static
from django.conf import settings

# API URLS
urlpatterns = [
    path('django/videos/', include('videos.urls')),
    path('django/auth/', include('authentication.urls')),
    path('django/admin/', admin.site.urls),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
