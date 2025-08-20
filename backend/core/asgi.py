# backend/core/asgi.py

import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

# Esta línea DEBE ser la primera, antes de cualquier otra importación de Django.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Esta llamada asegura que los settings de Django se carguen.
django.setup()

# AHORA, y solo ahora, importamos el resto de componentes que dependen de Django.
from chat.middleware import TokenAuthMiddleware
import chat.routing

application = ProtocolTypeRouter({
    # La llamada a get_asgi_application() se queda aquí para las peticiones HTTP.
    "http": get_asgi_application(),

    # Para WebSockets, usamos nuestra configuración de Channels.
    "websocket": TokenAuthMiddleware(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})