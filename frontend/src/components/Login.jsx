// frontend/src/Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            // Usamos la instancia de api para que las cabeceras se configuren automáticamente
            const res = await api.post('/token/', formData);
            const { access, refresh } = res.data;

            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

            // El interceptor de api.js ya no es necesario aquí, pero lo dejamos por si acaso
            api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            if (onLoginSuccess) {
                onLoginSuccess();
            }

            navigate('/');

        } catch (err) {
            console.error('Error en el login:', err.response ? err.response.data : err);
            if (err.response && err.response.status === 401 && err.response.data.detail === "No active account found with the given credentials") {
                setMessage('Tu cuenta no está activa. Por favor, revisa tu correo electrónico para encontrar el enlace de activación.');
            } else {
                setMessage('Error: Usuario o contraseña incorrectos.');
            }
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />
                </div>
                <button type="submit">Entrar</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;