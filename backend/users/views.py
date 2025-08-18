# from django.shortcuts import render

# # Create your views here.
# # Endpoint prueba
# from django.http import JsonResponse

# def test_view(request):
#   return JsonResponse({'message': '¡Hola desde Django!'})


from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny # <-- Importa AllowAny

# CreateAPIView es una vista genérica de DRF que maneja peticiones POST para crear objetos
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny] # <-- Permite que cualquier usuario (incluso no autenticado) pueda registrarse


