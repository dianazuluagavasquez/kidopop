# from django.shortcuts import render

# # Create your views here.
# # Endpoint prueba
# from django.http import JsonResponse

# def test_view(request):
#   return JsonResponse({'message': '¡Hola desde Django!'})


from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

# Email verification imports
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str


class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
            str(user.pk) + str(timestamp) + str(user.is_active)
        )

account_activation_token = AccountActivationTokenGenerator()


# CreateAPIView es una vista genérica de DRF que maneja peticiones POST para crear objetos
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        
        # Send verification email
        mail_subject = 'Activa tu cuenta de KidoPop.'
        # The verification link will point to your frontend, which will then call the backend API
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = account_activation_token.make_token(user)
        # IMPORTANT: Change 'localhost:5173' to your actual frontend domain in production
        activation_link = f"http://localhost:5173/activate/{uid}/{token}"
        
        message = f'Hola {user.first_name},\n\nPor favor, haz clic en el siguiente enlace para activar tu cuenta en KidoPop:\n{activation_link}'
        
        send_mail(mail_subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({'message': 'Gracias por tu confirmación por correo electrónico. Ahora puedes iniciar sesión en tu cuenta.'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'El enlace de activación no es válido.'}, status=status.HTTP_400_BAD_REQUEST)


class EmailTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        if 'email' in request.data:
            request.data['username'] = request.data['email']
        return super().post(request, *args, **kwargs)


class ProfileView(APIView):
    # Solo los usuarios autenticados pueden ver su perfil
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # request.user contiene el usuario autenticado gracias al token JWT
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
