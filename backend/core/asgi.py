# backend/core/asgi.py

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import chat.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Este es el "controlador de tráfico" principal
application = ProtocolTypeRouter({
    # Para peticiones normales (HTTP), usa la configuración estándar de Django
    "http": get_asgi_application(),

    # Para peticiones en tiempo real (WebSocket), usa el enrutador de Channels
    "websocket": AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})