// frontend/src/components/ProductList.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from './ProductCard'; 
import './ProductList.css';           

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- La lógica para pedir los datos AHORA VIVE AQUÍ ---
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products/');
                setProducts(res.data);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('No se pudieron cargar los productos.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []); // El array vacío asegura que solo se ejecute una vez

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Novedades</h2>
            <div className="product-list-grid">
                {products.length > 0 ? (
                    products.map(product => (
                        // Usamos el nuevo componente ProductCard para cada producto
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p>No hay productos a la venta todavía. ¡Sé el primero!</p>
                )}
            </div>
        </div>
    );
};

export default ProductList;