import { useState, useEffect } from 'react'
import axios from 'axios'
import Register from './components/Register';
import Login from './components/Login';
import './App.css'

function App() {
  return (
        <div className="App">
            <header className="App-header">
                <h1>Bienvenido a KidoPop</h1>
                <Register />
                <Login/>
            </header>
        </div>
    );
}

export default App

