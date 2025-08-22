// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// Importa tus páginas
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ChatLayoutPage from './pages/ChatLayoutPage';
import ProductUploadPage from './pages/ProductUploadPage';
import ProfilePage from './pages/ProfilePage';
import ProductEditPage from './pages/ProductEditPage';
import CategoryButtons from './components/CategoryButtons';
import Loader from './components/Loader';

import api from './services/api';
import './App.scss';

//imagenes
import kidoPopLogo from './assets/img/kidopop.svg';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');
    return token ? children : <Navigate to="/auth" />;
};

const Navbar = ({ isLoggedIn, handleLogout, hasUnreadMessages }) => {
    return (
        <header className='k-h'>
            <div className='k-h-c k-c'>
            <Link to="/" className='k-lg'><img src={kidoPopLogo} alt="" /></Link>
            <nav className='k-nav'>
                <div className='k-nav-c'>
                    {isLoggedIn ? (
                        <>
                            <Link className='k-nav-link  k-btn' to="/upload-product" >Vender</Link>
                            <Link className='k-nav-link' to="/messages" >
                                Mis Mensajes
                                {hasUnreadMessages && <span className="notification-dot"></span>}
                            </Link>
                            <Link className='k-nav-link' to="/profile">Mi Perfil</Link>
                            <button onClick={handleLogout}>Cerrar Sesión</button>
                        </>
                    ) : (
                        <>
                            <Link  to="/auth" className="k-nav-link k-btn k-btn-ln">Regístrate o Inicia sesión</Link>
                            <Link  to="/auth" className="k-nav-link k-btn">Vender</Link>
                        </>
                    )}
                </div>
            </nav>
            </div>
        </header>
    );
};

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');

    const fetchUnreadStatus = async () => {
        try {
            const res = await api.get('/chat/unread-count/');
            setHasUnreadMessages(res.data.has_unreads);
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
        setLoadingAuth(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete api.defaults.headers.common['Authorization'];
        setIsLoggedIn(false);
        setHasUnreadMessages(false);
        window.location.href = '/';
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
        fetchUnreadStatus();
    };

    if (loadingAuth) {
        return <Loader />;
    }

    return (
        <Router>
            <div className="App">
                <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} hasUnreadMessages={hasUnreadMessages} />
                <div className='k-cat-c'>
                    <CategoryButtons 
                        selectedCategory={selectedCategory} 
                        onCategoryChange={setSelectedCategory} 
                    />
                </div>
                <main className='k-c'>
                    <Routes>
                        {/* --- RUTAS PÚBLICAS --- */}
                        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} selectedCategory={selectedCategory} />} />
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