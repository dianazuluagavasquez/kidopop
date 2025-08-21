# backend/chat/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Conversation, Message 

class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class ConversationSerializer(serializers.ModelSerializer):
    other_participant = serializers.SerializerMethodField()
    has_unread_messages = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'other_participant', 'created_at', 'has_unread_messages']

    def get_other_participant(self, obj):
        current_user = self.context['request'].user
        other_user = obj.participants.exclude(id=current_user.id).first()
        if other_user:
            return SimpleUserSerializer(other_user).data
        return None

    # --- ¡AQUÍ ESTÁ LA FUNCIÓN CORREGIDA/AÑADIDA! ---
    # El nombre de esta función debe coincidir exactamente con el campo de arriba.
    def get_has_unread_messages(self, obj):
        current_user = self.context['request'].user
        # .exists() es más rápido que .count() para esta tarea
        return obj.messages.exclude(sender=current_user).filter(is_read=False).exists()


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = Message
        # Añadimos is_read para que el frontend pueda usarlo si es necesario
        fields = ['id', 'conversation', 'sender', 'sender_username', 'content', 'timestamp', 'is_read']