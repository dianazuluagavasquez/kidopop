// frontend/src/pages/ChatPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // <-- Importa la librería

const ChatPage = () => {
    const { conversationId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const ws = useRef(null); // useRef para mantener la conexión WebSocket

    // Obtener el ID del usuario actual desde el token
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const decodedToken = jwtDecode(token);
            setCurrentUser({ id: decodedToken.user_id });
        }
    }, []);

    // Efecto para manejar la conexión WebSocket
    useEffect(() => {
        if (!conversationId) return;

        // Conectar al WebSocket. La URL debe coincidir con tu routing de Channels.
        const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${conversationId}/`);

        socket.onopen = () => {
            console.log("WebSocket conectado!");
        };

        // Escuchar mensajes que llegan desde el servidor
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Añade el mensaje nuevo a la lista de mensajes existentes
            setMessages(prevMessages => [...prevMessages, data]);
        };

        socket.onclose = () => {
            console.log("WebSocket desconectado.");
        };

        socket.onerror = (error) => {
            console.error("Error en WebSocket:", error);
        };

        ws.current = socket;

        // Función de limpieza: se ejecuta cuando el componente se desmonta
        return () => {
            socket.close();
        };
    }, [conversationId]); // Se reconecta si el ID de la conversación cambia

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !ws.current || ws.current.readyState !== WebSocket.OPEN) {
            return;
        }

        // Envía el mensaje al servidor en formato JSON
        ws.current.send(JSON.stringify({
            'message': newMessage,
            'sender': currentUser.id // Enviamos el ID del remitente
        }));
        
        setNewMessage(''); // Limpia el input
    };

    return (
        <div>
            <h2>Chat de la Conversación {conversationId}</h2>
            <div style={{ border: '1px solid #ccc', height: '400px', overflowY: 'scroll', padding: '10px', marginBottom: '10px' }}>
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        style={{ 
                            textAlign: msg.sender === currentUser?.id ? 'right' : 'left', 
                            marginBottom: '10px' 
                        }}
                    >
                        <p style={{
                            display: 'inline-block',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            backgroundColor: msg.sender === currentUser?.id ? '#dcf8c6' : '#f1f0f0'
                        }}>
                            {msg.message}
                        </p>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    style={{ width: '80%', padding: '10px' }}
                />
                <button type="submit" style={{ width: '19%', padding: '10px' }}>Enviar</button>
            </form>
        </div>
    );
};

export default ChatPage;