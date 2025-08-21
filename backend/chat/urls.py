# backend/chat/urls.py
from django.urls import path
from .views import StartConversationView, ConversationListView, MessageListView, UnreadMessagesCountView, MarkMessagesAsReadView

urlpatterns = [
    path('start/', StartConversationView.as_view(), name='start-conversation'),
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('conversations/<int:conversation_id>/messages/', MessageListView.as_view(), name='message-list'),
    path('unread-count/', UnreadMessagesCountView.as_view(), name='unread-messages-count'),
    path('conversations/<int:conversation_id>/read/', MarkMessagesAsReadView.as_view(), name='mark-messages-as-read'),
]