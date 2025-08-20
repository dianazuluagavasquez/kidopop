# backend/chat/urls.py
from django.urls import path
from .views import StartConversationView , ConversationListView, MessageListView

urlpatterns = [
    path('start/', StartConversationView.as_view(), name='start-conversation'),
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('conversations/<int:conversation_id>/messages/', MessageListView.as_view(), name='message-list'),
]