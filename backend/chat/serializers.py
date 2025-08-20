# backend/chat/serializers.py
from rest_framework import serializers
from .models import Conversation, Message 

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'created_at']
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        # Incluimos todos los campos del modelo Message
        fields = '__all__'