// frontend/src/Register.jsx

import React, { useState } from 'react';
//import axios from 'axios';
import api from '../services/api'

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [message, setMessage] = useState(''); // Para mostrar mensajes de éxito o error

    const { username, email, password } = formData;

    // Esta función actualiza el estado cada vez que escribes en un input
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Esta función se ejecuta cuando envías el formulario
    const onSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        try {
            // Hacemos la petición POST a nuestro endpoint de Django
            // Asegúrate de que la URL es correcta. Por defecto es http://127.0.0.1:8000
            const res = await api.post('/register/', formData);

            console.log('Respuesta del servidor:', res.data);
            setMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');

        } catch (err) {
            console.error('Error en el registro:', err.response.data);
            // Extraemos y mostramos los mensajes de error que envía Django
            const errors = err.response.data;
            let errorMessage = 'Error en el registro. ';
            if (errors.username) errorMessage += `Username: ${errors.username.join(' ')} `;
            if (errors.email) errorMessage += `Email: ${errors.email.join(' ')} `;
            if (errors.password) errorMessage += `Password: ${errors.password.join(' ')} `;

            setMessage(errorMessage);
        }
    };

    return (
        <div>
            <h2>Formulario de Registro</h2>
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
                        minLength="6"
                        required
                    />
                </div>
                <button type="submit">Registrarse</button>
            </form>
            {/* Muestra el mensaje de éxito o error aquí */}
            {message && <p>{message}</p>} 
        </div>
    );
};

export default Register;