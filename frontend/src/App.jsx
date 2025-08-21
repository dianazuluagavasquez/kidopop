// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// Importa tus páginas existentes (rutas corregidas si es necesario)
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ChatLayoutPage from './pages/ChatLayoutPage';

// --- Importa las nuevas páginas (RUTAS CORREGIDAS) ---
import ProductUploadPage from './pages/ProductUploadPage'; 
import ProfilePage from './pages/ProfilePage';  
import ProductEditPage from './pages/ProductEditPage';         

import api from './services/api';
import './App.css';

// --- Componente de Ruta Privada (sin cambios) ---
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/auth" />;
};

// --- Componente de Barra de Navegación (sin cambios) ---
const Navbar = ({ isLoggedIn, handleLogout }) => {
    return (
        <nav>
            <Link to="/"><h1>KidoPop Marketplace</h1></Link>
            <div>
                {isLoggedIn ? (
                    <>
                        <Link to="/upload-product" className="nav-button">Vender</Link>
                        <Link to="/messages" className="nav-link">Mis Mensajes</Link>
                        <Link to="/profile" className="nav-link">Mi Perfil</Link>
                        <button onClick={handleLogout}>Cerrar Sesión</button>
                    </>
                ) : (
                    <>
                        <Link to="/auth" className="nav-link">Registrate o Inicia sesión</Link>
                        <Link to="/auth" className="nav-button">Vender</Link>
                    </>
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
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setIsLoggedIn(true);
        }
    }, []);
    
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete api.defaults.headers.common['Authorization'];
        setIsLoggedIn(false);
    };
    
    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <Router>
            <div className="App">
                <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                <main>
                    <Routes>
                        {/* --- RUTAS PÚBLICAS --- */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/auth" element={<AuthPage handleLogin={handleLogin} />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />

                        {/* --- RUTAS PRIVADAS --- */}
                        <Route path="/messages" element={<PrivateRoute><ChatLayoutPage /></PrivateRoute>} />
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