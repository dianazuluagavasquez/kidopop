// frontend/src/components/ConversationList.jsx
import React from 'react';
import Loader from './Loader';

import './ConversationList.scss';

// El componente ahora es "tonto": solo recibe datos y los muestra
const ConversationList = ({ onSelectConversation, selectedConversationId, conversations, loading }) => {

    if (loading) return <Loader />;;

    return (
        <div className="conversation-list">
            <h4>Conversaciones</h4>
            {conversations.length > 0 ? (
                <ul>
                    {conversations.map(convo => (
                        <li
                            key={convo.id}
                            onClick={() => onSelectConversation(convo.id, convo.other_participant)}
                            className={selectedConversationId === convo.id ? 'selected' : ''}
                        >
                            <span className="participant-name">
                                {convo.other_participant ? convo.other_participant.username : 'Usuario desconocido'}
                            </span>
                            {/* Ahora sí mostrará el punto, porque recibe la información actualizada */}
                            {convo.has_unread_messages && (
                                <span className="unread-dot"></span>
                            )}
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