// frontend/src/components/ChatWindow.jsx

import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import './ChatWindow.css';

const ChatWindow = ({ conversationId, participant }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const ws = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setCurrentUser({ id: decodedToken.user_id });
        }
    }, []);

    useEffect(() => {
        if (!conversationId) return;

        setMessages([]);

        const fetchAndConnect = async () => {
            try {
                const res = await api.get(`/chat/conversations/${conversationId}/messages/`);
                setMessages(res.data);
            } catch (error) {
                console.error("Error al cargar el historial de mensajes", error);
            }

            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) return;

            const socket = new WebSocket(
                `ws://127.0.0.1:8000/ws/chat/${conversationId}/?token=${accessToken}`
            );

            socket.onopen = () => console.log("WebSocket conectado!");
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessages(prevMessages => [...prevMessages, data.message]);
            };
            socket.onclose = () => console.log("WebSocket desconectado.");
            socket.onerror = (error) => console.error("Error en WebSocket:", error);
            ws.current = socket;
        };

        fetchAndConnect();

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [conversationId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

        ws.current.send(JSON.stringify({
            'message': newMessage
        }));
        
        setNewMessage('');
    };

    if (!conversationId || !participant) {
        return <div className="chat-placeholder">Selecciona una conversación para empezar a chatear.</div>;
    }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h3>Chat con {participant.username}</h3>
            </div>
            <div className="messages-area">
                {messages.map((msg) => {
                    // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
                    // Comparamos los valores como números para evitar errores de tipo.
                    const isSentByCurrentUser = currentUser && Number(msg.sender) === Number(currentUser.id);
                    
                    return (
                        <div 
                            key={msg.id}
                            className={`message-bubble ${isSentByCurrentUser ? 'sent' : 'received'}`}
                        >
                            {!isSentByCurrentUser && (
                                <div className="sender-name">{msg.sender_username}</div>
                            )}
                            <div className="message-content">{msg.content}</div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} style={{ display: 'flex' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Escribe un mensaje..."
                    style={{ flexGrow: 1, padding: '10px' }}
                />
                <button type="submit" style={{ padding: '10px' }}>Enviar</button>
            </form>
        </div>
    );
};

export default ChatWindow;