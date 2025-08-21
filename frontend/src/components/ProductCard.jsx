// frontend/src/components/ProductCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, isOwnerView = false, onMarkAsSold, onDelete }) => {
    
    // --- LÓGICA DE IMAGEN A PRUEBA DE ERRORES ---
    let imageUrl = 'https://placehold.co/600x400'; // Imagen por defecto

    if (product.image) {
        // Si la ruta de la imagen ya empieza con 'http', la usamos directamente.
        // Si no, construimos la URL completa.
        if (product.image.startsWith('http')) {
            imageUrl = product.image;
        } else {
            imageUrl = `http://127.0.0.1:8000${product.image}`;
        }
    }

    const handleSoldClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onMarkAsSold(product.id, product.title);
    };

    const handleDeleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(product.id, product.title);
    };

    return (
        <div className={`product-card ${product.status === 'sold' ? 'is-sold' : ''}`}>
            {product.status === 'sold' && <div className="sold-overlay">Vendido</div>}
            
            <Link to={`/product/${product.id}`}>
                <img src={imageUrl} alt={product.title} className="product-card-image" />
                <div className="product-card-info">
                    <p className="product-card-price">{parseFloat(product.price).toFixed(2)} €</p>
                    <h3 className="product-card-title">{product.title}</h3>
                </div>
            </Link>

            {isOwnerView && (
                <div className="owner-actions-container">
                    {product.status === 'available' && (
                        <div className="owner-actions">
                             <Link to={`/product/${product.id}/edit`} className="edit-button-link">
                                <button className="edit-button">Editar</button>
                            </Link>
                            <button className="sold-button" onClick={handleSoldClick}>Vendido</button>
                        </div>
                    )}
                    
                    <div className="owner-actions-delete">
                        <button className="delete-button" onClick={handleDeleteClick}>Eliminar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCard;