// frontend/src/components/Modal.jsx

import React from 'react';
import './Modal.scss';

const Modal = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h4>{title}</h4>
                    <button className="modal-close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <button className="modal-button cancel" onClick={onClose}>Cancelar</button>
                    <button className="modal-button confirm" onClick={onConfirm}>Confirmar</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;