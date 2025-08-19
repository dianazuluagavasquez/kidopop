// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ChatPage from './pages/ChatPage'; 
import './App.css';

// Un componente simple para proteger rutas
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
            <Link to="/"><h1>KidoPop Marketplace</h1></Link>
        </nav>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/product/:id" element={<PrivateRoute><ProductDetailPage /></PrivateRoute>} />
         <Route 
            path="/chat/:conversationId" 
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;