// frontend/src/components/ChatWindow.jsx

import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const ChatWindow = ({ conversationId }) => {
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
            // 1. Cargar historial de mensajes.
            // Ya no necesitamos pasar el token manualmente, 'api' se encarga de todo.
            try {
                const res = await api.get(`/chat/conversations/${conversationId}/messages/`);
                setMessages(res.data);
            } catch (error) {
                console.error("Error al cargar el historial de mensajes", error);
            }

            // 2. Conectar al WebSocket.
            // Obtenemos el token aquí solo para pasarlo en la URL.
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
            // Ya no es necesario enviar el 'sender', el backend lo sabe por el token
        }));
        
        setNewMessage('');
    };

    if (!conversationId) {
        return <div style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>Selecciona una conversación para empezar a chatear.</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h2>Chat</h2>
            <div style={{ flexGrow: 1, border: '1px solid #ccc', overflowY: 'scroll', padding: '10px', marginBottom: '10px' }}>
                {messages.map((msg) => (
                    <div 
                        key={msg.id} // Usa un ID único del mensaje si lo tienes, es mejor que el index
                        style={{ textAlign: msg.sender === currentUser?.id ? 'right' : 'left', marginBottom: '10px' }}
                    >
                        <p style={{
                            display: 'inline-block', padding: '8px 12px', borderRadius: '10px',
                            backgroundColor: msg.sender === currentUser?.id ? '#dcf8c6' : '#f1f0f0'
                        }}>
                            {msg.content} {/* El contenido del mensaje está en 'content' */}
                        </p>
                    </div>
                ))}
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