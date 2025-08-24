# from django.shortcuts import render

# # Create your views here.
# # Endpoint prueba
# from django.http import JsonResponse

# def test_view(request):
#   return JsonResponse({'message': '¡Hola desde Django!'})


from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

# CreateAPIView es una vista genérica de DRF que maneja peticiones POST para crear objetos
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class ProfileView(APIView):
    # Solo los usuarios autenticados pueden ver su perfil
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # request.user contiene el usuario autenticado gracias al token JWT
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
