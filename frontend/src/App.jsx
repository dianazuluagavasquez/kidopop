// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ChatLayoutPage from './pages/ChatLayoutPage';
import api from './services/api'; // <-- Importamos nuestro servicio de API
import './App.css';

// --- Componente de Ruta Privada (sin cambios) ---
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/auth" />;
};

// --- Componente de Barra de Navegación ---
const Navbar = ({ isLoggedIn, handleLogout }) => {
    return (
        <nav>
            <Link to="/"><h1>KidoPop Marketplace</h1></Link>
            <div>
                {isLoggedIn ? (
                    <>
                        <Link to="/messages" style={{ marginRight: '15px' }}>Mis Mensajes</Link>
                        <button onClick={handleLogout}>Cerrar Sesión</button>
                    </>
                ) : (
                    <Link to="/auth">Login / Registro</Link>
                )}
            </div>
        </nav>
    );
};

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            // Si encontramos un token, lo configuramos en las cabeceras
            // por defecto de nuestra instancia 'api'.
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setIsLoggedIn(true);
        }
    }, []);
    
    // Función para manejar el logout
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete api.defaults.headers.common['Authorization']; // Borra la cabecera
        setIsLoggedIn(false);
    };
    
    // Esta función la pasaremos a la página de Login
    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <Router>
            <div className="App">
                <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                
                <main>
                    <Routes>
                        <Route path="/auth" element={<AuthPage handleLogin={handleLogin} />} />
                        <Route path="/product/:id" element={<PrivateRoute><ProductDetailPage /></PrivateRoute>} />
                          <Route path="/messages" element={<PrivateRoute><ChatLayoutPage /></PrivateRoute>} />
                        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;