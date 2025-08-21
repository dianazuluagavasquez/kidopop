// frontend/src/pages/AuthPage.jsx

import React from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

const AuthPage = ({ handleLogin }) => {
  return (
    <div>
      <h2>Bienvenido</h2>
      <div style={{ display: 'flex', gap: '50px', justifyContent: 'center' }}>
        <Register />
         <Login onLoginSuccess={handleLogin} />
      </div>
    </div>
  );
};

export default AuthPage;