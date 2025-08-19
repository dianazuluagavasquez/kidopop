# backend/chat/views.py
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Conversation
from .serializers import ConversationSerializer
from django.db.models import Q

class StartConversationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # El ID del usuario con el que queremos chatear (el vendedor)
        participant_id = request.data.get('participant_id')

        if not participant_id:
            return Response({'error': 'Participant ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            participant = User.objects.get(id=participant_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Busca una conversación que tenga exactamente a estos dos participantes
        conversation = Conversation.objects.filter(
            participants=request.user
        ).filter(
            participants=participant
        )

        # Esta parte es para asegurar que solo devuelva conversaciones de 2 personas
        # Si quisieras chats grupales, la lógica sería diferente.
        exact_conversation = None
        for conv in conversation:
            if conv.participants.count() == 2:
                exact_conversation = conv
                break

        if exact_conversation:
            # Si ya existe, la devolvemos
            serializer = ConversationSerializer(exact_conversation)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Si no existe, creamos una nueva
            new_conversation = Conversation.objects.create()
            new_conversation.participants.add(request.user, participant)
            serializer = ConversationSerializer(new_conversation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)