// frontend/src/pages/ProductDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import axios from 'axios';
import api from '../services/api'
import MapDisplay from '../components/MapDisplay';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
               const res = await api.get(`/products/${id}/`);
               setProduct(res.data);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('No se pudo encontrar el producto.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleStartChat = async () => {
        if (!product || !product.owner) {
            console.error("No se puede iniciar el chat: el dueño del producto no está definido.");
            return;
        }

        try {

            const res = await api.post('/chat/start/', { 
                participant_id: product.owner 
            });

            const conversationId = res.data.id;
            navigate(`/messages?open=${conversationId}`);

        } catch (err) {

            console.error("Error al iniciar la conversación. La redirección será manejada por el interceptor.", err);
        }
    };

    if (loading) return <p>Cargando producto...</p>;
    if (error) return <p>{error}</p>;
    if (!product) return <p>Producto no encontrado.</p>;

    return (
        <div>
            {product.image && <img src={product.image} alt={product.title} style={{ maxWidth: '400px', borderRadius: '8px' }} />}
            <h1>{product.title}</h1>
            <h2>{product.price} €</h2>
            <div className="categories-container">
                {product.categories && product.categories.map(cat => (
                    <span key={cat.id} className="category-tag-detail">{cat.name}</span>
                ))}
            </div>
            <p><strong>Estado:</strong> {product.condition}</p>
            <p><strong>Marca:</strong> {product.brand || 'No especificada'}</p>
            <p><strong>Descripción:</strong></p>
            <p>{product.description}</p>
            
            <p><strong>Ubicación:</strong> {product.location_text || `Coordenadas: ${product.latitude}, ${product.longitude}`}</p>
            <MapDisplay 
                lat={product.latitude} 
                lon={product.longitude} 
                text={product.location_text}
            />
            
            <button onClick={handleStartChat}>Chatear con el vendedor</button>
        </div>
    );
};

export default ProductDetailPage;