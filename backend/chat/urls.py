# backend/chat/urls.py
from django.urls import path
from .views import StartConversationView

urlpatterns = [
    path('start/', StartConversationView.as_view(), name='start-conversation'),
]