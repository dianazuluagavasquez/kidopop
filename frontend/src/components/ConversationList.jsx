// frontend/src/components/ConversationList.jsx
import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import api from '../services/api'
// Ya no necesitamos Link

// Recibe una función 'onSelectConversation' del componente padre
const ConversationList = ({ onSelectConversation }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                // Hacemos la llamada a la API para obtener las conversaciones del usuario
                const res = await api.get('/chat/conversations/');
                setConversations(res.data);
            } catch (err) {
                console.error("Error al cargar las conversaciones", err);
                setError("No se pudieron cargar tus conversaciones.");
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    if (loading) return <p>Cargando...</p>;

    return (
        <div>
            <h4>Conversaciones</h4>
            {conversations.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {conversations.map(convo => (
                        // Al hacer clic, llama a la función del padre con el ID de la convo
                        <li key={convo.id} onClick={() => onSelectConversation(convo.id)} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>
                            Conversación con ID: {convo.id}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tienes conversaciones.</p>
            )}
        </div>
    );
};

export default ConversationList;