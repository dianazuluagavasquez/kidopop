// frontend/src/pages/ChatLayoutPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import api from '../services/api';

const ChatLayoutPage = ({ onEnterChat }) => {
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [otherParticipant, setOtherParticipant] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    // Esta función ahora carga las conversaciones para esta página
    const fetchConversations = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/chat/conversations/');
            setConversations(res.data);
        } catch (err) {
            console.error("Error al cargar las conversaciones", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const handleSelectConversation = async (convoId, participant) => {
        setSelectedConversationId(convoId);
        setOtherParticipant(participant);

        try {
            await api.post(`/chat/conversations/${convoId}/read/`);
            // 1. Refrescamos la lista local para que el punto del chat desaparezca
            await fetchConversations();
            // 2. Refrescamos el indicador global en el Navbar
            onEnterChat();
        } catch (err) {
            console.error("Error al marcar los mensajes como leídos", err);
        }
    };

    return (
        <div style={{ display: 'flex', height: '80vh', border: '1px solid #ccc' }}>
            <div style={{ width: '30%', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
                <ConversationList
                    onSelectConversation={handleSelectConversation}
                    selectedConversationId={selectedConversationId}
                    conversations={conversations}
                    loading={loading}
                />
            </div>
            <div style={{ width: '70%', padding: '10px' }}>
                <ChatWindow
                    conversationId={selectedConversationId}
                    participant={otherParticipant}
                />
            </div>
        </div>
    );
};

export default ChatLayoutPage;