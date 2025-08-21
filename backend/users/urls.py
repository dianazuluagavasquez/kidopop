# backend/users/urls.py

from django.urls import path
from .views import RegisterView, ProfileView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Esta ruta se combina con la del archivo principal, creando la URL final: /api/register/
    path('register/', RegisterView.as_view(), name='register'),
    
    # 1. El frontend enviará 'username' y 'password' aquí para obtener los tokens
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # 2. Esta ruta servirá en el futuro para renovar un token sin volver a loguearse
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='user-profile'),
]
