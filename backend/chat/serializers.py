# backend/chat/serializers.py
from rest_framework import serializers
from .models import Conversation

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'created_at']