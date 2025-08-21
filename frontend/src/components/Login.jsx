// frontend/src/Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const { username, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            // Hacemos la petición a la ruta '/api/token/' que acabamos de crear
            const res = await axios.post('http://127.0.0.1:8000/api/token/', formData);
            const { access, refresh } = res.data;

            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

            api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            if (onLoginSuccess) {
                onLoginSuccess();
            }

            navigate('/');

        } catch (err) {
            console.error('Error en el login:', err.response ? err.response.data : err);
            setMessage('Error: Usuario o contraseña incorrectos.');
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Nombre de usuario"
                        name="username"
                        value={username}
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