// frontend/src/pages/ActivationPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api'; // Import the api instance
import Loader from '../components/Loader';

const ActivationPage = () => {
    const { uid, token } = useParams();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Verificando tu cuenta...');

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                const response = await api.get(`/verify-email/${uid}/${token}/`);
                setStatus('success');
                setMessage(response.data.message);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Ha ocurrido un error al verificar tu cuenta.');
            }
        };

        verifyAccount();
    }, [uid, token]);

    return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
            {status === 'verifying' && <Loader />}
            
            {status !== 'verifying' && (
                <>
                    <h1>{status === 'success' ? '¡Cuenta Activada!' : 'Error de Activación'}</h1>
                    <p>{message}</p>
                    {status === 'success' && (
                        <Link to="/auth" className="k-btn" style={{ marginTop: '20px' }}>
                            Ir a Iniciar Sesión
                        </Link>
                    )}
                </>
            )}
        </div>
    );
};

export default ActivationPage;
