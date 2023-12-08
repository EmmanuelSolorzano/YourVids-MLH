from django.urls import path
from authentication.views import RegisterView, get_authenticated_user#, RetrieveUserAPIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    #path('user/', RetrieveUserAPIView.as_view(), name='get_user'),
    path('get-authenticated-user/', get_authenticated_user, name='get-authenticated-user'),
]