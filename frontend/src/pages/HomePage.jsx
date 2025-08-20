// frontend/src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import api from '../services/api'
import ProductUpload from './ProductUpload';
import ProductList from './ProductList';

const HomePage = () => {
  const [products, setProducts] = useState([]); // <-- El estado vive aquí ahora
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/products/');
            setProducts(res.data);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('No se pudieron cargar los productos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/auth'; // Redirige al usuario al login
  };

   const handleProductUploaded = () => {
        fetchProducts(); // Simplemente volvemos a cargar la lista de productos
    };

  return (
        <div>
            <button onClick={handleLogout} style={{ float: 'right' }}>Cerrar Sesión</button>
            {/* Le pasamos la función de callback a ProductUpload */}
            <ProductUpload onProductUploaded={handleProductUploaded} />
            <hr />
            {/* Le pasamos los datos y el estado a ProductList */}
            <ProductList products={products} loading={loading} error={error} />
        </div>
    );
};

export default HomePage;