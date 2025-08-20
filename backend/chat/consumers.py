# backend/chat/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, Conversation
from django.contrib.auth.models import User
from .serializers import MessageSerializer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # AuthMiddlewareStack nos da el usuario en self.scope['user']
        # Verificamos si el usuario está autenticado.
        if self.scope['user'].is_authenticated:
            self.room_name = self.scope['url_route']['kwargs']['room_name']
            self.room_group_name = f'chat_{self.room_name}'

            # Unirse a la sala de chat
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            # Aceptar la conexión
            await self.accept()
        else:
            # Si no está autenticado, rechazar la conexión.
            await self.close()

    async def disconnect(self, close_code):
        # Solo intenta salir del grupo si el usuario se conectó correctamente
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_content = text_data_json['message']
        
        # Para mayor seguridad, usamos el ID del usuario de la conexión (scope)
        # en lugar del que envía el frontend.
        sender_id = self.scope['user'].id

        # Guardar el mensaje en la base de datos
        new_message = await self.save_message(sender_id, message_content)
        
        # Serializar el mensaje para enviarlo con todos sus datos (ID, timestamp, etc.)
        serializer = MessageSerializer(new_message)
        
        # Enviar el mensaje completo a todos en la sala de chat
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': serializer.data
            }
        )

    async def chat_message(self, event):
        message = event['message']

        # Enviar el objeto de mensaje completo al WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
 
    @database_sync_to_async
    def save_message(self, sender_id, message_content):
        sender = User.objects.get(id=sender_id)
        conversation = Conversation.objects.get(id=self.room_name)
        message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            content=message_content
        )
        return message