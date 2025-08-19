# # backend/chat/consumers.py

# import json
# from channels.generic.websocket import AsyncWebsocketConsumer

# class ChatConsumer(AsyncWebsocketConsumer):
#     # Este método se llama cuando un usuario intenta conectarse.
#     async def connect(self):
#         # Obtenemos el ID de la sala de chat desde la URL.
#         self.room_name = self.scope['url_route']['kwargs']['room_name']
#         self.room_group_name = f'chat_{self.room_name}'

#         # Unirse a la sala de chat (grupo de Channels).
#         await self.channel_layer.group_add(
#             self.room_group_name,
#             self.channel_name
#         )

#         # Aceptar la conexión WebSocket.
#         await self.accept()

#     # Este método se llama cuando la conexión se cierra.
#     async def disconnect(self, close_code):
#         # Salir de la sala de chat.
#         await self.channel_layer.group_discard(
#             self.room_group_name,
#             self.channel_name
#         )

#     # Este método se llama cuando se recibe un mensaje desde el WebSocket (frontend).
#     async def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         message = text_data_json['message']
#         sender = text_data_json['sender']

#         # Enviar el mensaje a todos en la sala de chat.
#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 'type': 'chat_message', # Llama al método chat_message
#                 'message': message,
#                 'sender': sender
#             }
#         )

#     # Recibe el mensaje desde el grupo y lo envía de vuelta al WebSocket (frontend).
#     async def chat_message(self, event):
#         message = event['message']
#         sender = event['sender']

#         # Enviar el mensaje al WebSocket.
#         await self.send(text_data=json.dumps({
#             'message': message,
#             'sender': sender
#         }))

# backend/chat/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            # Obtenemos el ID de la sala de chat desde la URL.
            self.room_name = self.scope['url_route']['kwargs']['room_name']
            self.room_group_name = f'chat_{self.room_name}'

            # Unirse a la sala de chat (grupo de Channels).
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            # Aceptar la conexión WebSocket.
            await self.accept()

        # except Exception as e:
        #     # Si algo falla en los pasos anteriores, lo imprimiremos aquí
        #     print(f"!!! ERROR en el método connect: {e}")
        #     # También imprimiremos el objeto 'scope' para ver qué contiene
        #     print("SCOPE:", self.scope)
        # # --- FIN DE CÓDIGO DE DEPURACIÓN ---

    async def disconnect(self, close_code):
        print(f"--- Desconectado de la sala {self.room_name} ---")
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # ... (el resto del archivo 'receive' y 'chat_message' se queda igual) ...
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender = text_data_json['sender']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender
        }))