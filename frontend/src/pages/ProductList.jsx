// frontend/src/pages/ProductList.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 

const ProductList = ({ products, loading, error }) => {

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Productos a la Venta</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {products.length > 0 ? (
                    products.map(product => (
            
                        <Link to={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', width: '200px' }}>
                                {product.image && <img src={product.image} alt={product.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />}
                                <h4>{product.title}</h4>
                                <p>{product.price} €</p>
                                <p>Estado: {product.condition}</p>
                                {product.categories.map(cat => (
                                    <span key={cat.id} style={{ backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', marginRight: '5px' }}>
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No hay productos a la venta todavía. ¡Sé el primero!</p>
                )}
            </div>
        </div>
    );
};

export default ProductList;