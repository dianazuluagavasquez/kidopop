# backend/chat/middleware.py

from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

User = get_user_model()

@database_sync_to_async
def get_user(token_key):
    """
    Intenta obtener un usuario a partir de un token de acceso JWT.
    """
    try:
        # Valida el token y obtiene su contenido (payload)
        access_token = AccessToken(token_key)
        # Obtiene el ID de usuario del token
        user_id = access_token['user_id']
        # Busca el usuario en la base de datos
        return User.objects.get(id=user_id)
    except (InvalidToken, TokenError, User.DoesNotExist):
        # Si el token es inválido o el usuario no existe, devuelve un usuario anónimo.
        return AnonymousUser()

class TokenAuthMiddleware:
    """
    Middleware de autenticación por token para WebSockets.
    """
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        # Obtiene los parámetros de la URL
        query_params = parse_qs(scope["query_string"].decode())
        token = query_params.get("token", [None])[0]

        # Obtiene el usuario y lo añade al scope de la conexión
        scope['user'] = await get_user(token)
        
        # Pasa la conexión a la siguiente capa de la aplicación
        return await self.app(scope, receive, send)