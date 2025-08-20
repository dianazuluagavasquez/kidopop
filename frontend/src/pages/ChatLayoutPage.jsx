// frontend/src/pages/ChatLayoutPage.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // <-- Importamos el hook
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';

const ChatLayoutPage = () => {
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [searchParams] = useSearchParams(); // <-- Inicializamos el hook

    // Este efecto se ejecuta una sola vez para ver si la URL nos pide abrir un chat
    useEffect(() => {
        const conversationToOpen = searchParams.get('open');
        if (conversationToOpen) {
            setSelectedConversationId(parseInt(conversationToOpen, 10));
        }
    }, [searchParams]);

    return (
        <div style={{ display: 'flex', height: '80vh', border: '1px solid #ccc' }}>
            <div style={{ width: '30%', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
                <ConversationList onSelectConversation={setSelectedConversationId} />
            </div>
            <div style={{ width: '70%', padding: '10px' }}>
                <ChatWindow conversationId={selectedConversationId} />
            </div>
        </div>
    );
};

export default ChatLayoutPage;