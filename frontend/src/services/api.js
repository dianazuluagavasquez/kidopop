// frontend/src/services/api.js

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

// --- EL INTERCEPTOR ---
// Se ejecuta en cada respuesta que recibimos de la API.
api.interceptors.response.use(
    (response) => response, // Si la respuesta es exitosa (2xx), no hace nada.
    async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 y no hemos reintentado ya esta petición.
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Marcamos la petición para no volver a reintentarla.

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                // Pedimos un nuevo accessToken usando el refreshToken.
                const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                    refresh: refreshToken,
                });

                const { access } = response.data;

                // Guardamos el nuevo token.
                localStorage.setItem('accessToken', access);

                // Actualizamos la cabecera de autorización para la nueva petición.
                originalRequest.headers['Authorization'] = `Bearer ${access}`;

                // Reintentamos la petición original que había fallado.
                return api(originalRequest);

            } catch (refreshError) {
                // Si el refresh token también falla (ha expirado, es inválido),
                // borramos todo y redirigimos al login.
                console.error("Refresh token inválido", refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/auth'; // Redirige a la página de login.
                return Promise.reject(refreshError);
            }
        }

        // Para cualquier otro error, simplemente lo devolvemos.
        return Promise.reject(error);
    }
);

export default api;