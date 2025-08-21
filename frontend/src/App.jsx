// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// ... (todas tus importaciones de páginas)
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ChatLayoutPage from './pages/ChatLayoutPage';
import ProductUploadPage from './pages/ProductUploadPage';
import ProfilePage from './pages/ProfilePage';
import ProductEditPage from './pages/ProductEditPage';

import api from './services/api';
import './App.css';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');
    return token ? children : <Navigate to="/auth" />;
};

const Navbar = ({ isLoggedIn, handleLogout, hasUnreadMessages }) => {
    // ... (El código de tu Navbar no necesita cambios)
    return (
        <nav>
            <Link to="/"><h1>KidoPop Marketplace</h1></Link>
            <div>
                {isLoggedIn ? (
                    <>
                        <Link to="/upload-product" className="nav-button">Vender</Link>
                        <Link to="/messages" className="nav-link">
                            Mis Mensajes
                            {hasUnreadMessages && <span className="notification-dot"></span>}
                        </Link>
                        <Link to="/profile" className="nav-link">Mi Perfil</Link>
                        <button onClick={handleLogout}>Cerrar Sesión</button>
                    </>
                ) : (
                    <>
                        <Link to="/auth" className="nav-link">Regístrate o Inicia sesión</Link>
                        <Link to="/auth" className="nav-button">Vender</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    // --- 1. NUEVO ESTADO DE CARGA ---
    const [loadingAuth, setLoadingAuth] = useState(true);

    const fetchUnreadStatus = async () => {
        try {
            const res = await api.get('/chat/unread-count/');
            setHasUnreadMessages(res.data.has_unread_messages);
        } catch (err) {
            console.error("Error al obtener el estado de no leídos", err);
            setHasUnreadMessages(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setIsLoggedIn(true);
            fetchUnreadStatus();
        }
        // --- 2. FINALIZA LA CARGA DE AUTENTICACIÓN ---
        // Haya o no token, hemos terminado de comprobarlo.
        setLoadingAuth(false);
    }, []);

    const handleLogout = () => { /* ... (sin cambios) */ };
    const handleLogin = () => { /* ... (sin cambios) */ };

    // --- 3. RENDERIZADO CONDICIONAL ---
    // Si todavía estamos comprobando el token, muestra un mensaje de carga.
    if (loadingAuth) {
        return <div>Cargando aplicación...</div>;
    }
console.log("Estado de mensajes no leídos (App.jsx):", hasUnreadMessages);
    return (
        <Router>
            <div className="App">
                <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} hasUnreadMessages={hasUnreadMessages} />
                <main>
                    <Routes>
                        {/* --- RUTAS PÚBLICAS --- */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/auth" element={<AuthPage handleLogin={handleLogin} />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />

                        {/* --- RUTAS PRIVADAS --- */}
                        <Route path="/messages" element={<PrivateRoute><ChatLayoutPage onEnterChat={fetchUnreadStatus} /></PrivateRoute>} />
                        <Route path="/product/:id/edit" element={<PrivateRoute><ProductEditPage /></PrivateRoute>} />
                        <Route path="/upload-product" element={<PrivateRoute><ProductUploadPage /></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;