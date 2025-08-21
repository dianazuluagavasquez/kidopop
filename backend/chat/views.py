# backend/chat/views.py
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from django.db.models import Q

class StartConversationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
      participant_id = request.data.get('participant_id')
      if not participant_id:
          return Response({'error': 'Participant ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
      try:
          participant = User.objects.get(id=participant_id)
      except User.DoesNotExist:
          return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
      conversation = Conversation.objects.filter(participants=request.user).filter(participants=participant)
      exact_conversation = None
      for conv in conversation:
          if conv.participants.count() == 2:
              exact_conversation = conv
              break
      if exact_conversation:
          serializer = ConversationSerializer(exact_conversation, context={'request': request})
          return Response(serializer.data, status=status.HTTP_200_OK)
      else:
          new_conversation = Conversation.objects.create()
          new_conversation.participants.add(request.user, participant)
          serializer = ConversationSerializer(new_conversation, context={'request': request})
          return Response(serializer.data, status=status.HTTP_201_CREATED)

class ConversationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        conversations = Conversation.objects.filter(participants=request.user)
        serializer = ConversationSerializer(conversations, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class MessageListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, conversation_id, *args, **kwargs):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
            if request.user not in conversation.participants.all():
                return Response({'error': 'Not a participant of this conversation.'}, status=status.HTTP_43_FORBIDDEN)
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation not found.'}, status=status.HTTP_404_NOT_FOUND)
        messages = conversation.messages.all().order_by('timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# --- ¡ASEGÚRATE DE QUE ESTA VISTA ESTÉ ASÍ! ---
class UnreadMessagesCountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Comprueba si existe al menos un mensaje no leído
        has_unread = Message.objects.filter(
            conversation__participants=request.user
        ).exclude(
            sender=request.user
        ).filter(
            is_read=False
        ).exists()
        # Devuelve un JSON con la clave correcta: 'has_unread_messages'
        return Response({'has_unread_messages': has_unread}, status=status.HTTP_200_OK)


class MarkMessagesAsReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, conversation_id, *args, **kwargs):
        Message.objects.filter(
            conversation_id=conversation_id,
            conversation__participants=request.user
        ).exclude(
            sender=request.user
        ).update(is_read=True)
        return Response(status=status.HTTP_200_OK)