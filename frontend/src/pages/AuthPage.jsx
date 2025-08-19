// frontend/src/pages/AuthPage.jsx

import React from 'react';
import Login from './Login';
import Register from './Register';

const AuthPage = () => {
  return (
    <div>
      <h2>Bienvenido</h2>
      <div style={{ display: 'flex', gap: '50px', justifyContent: 'center' }}>
        <Register />
        <Login />
      </div>
    </div>
  );
};

export default AuthPage;