// frontend/src/pages/ProductDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
                // --- AÑADE EL TOKEN AQUÍ TAMBIÉN PARA VER PRODUCTOS ---
                const accessToken = localStorage.getItem('accessToken');
                const res = await axios.get(`http://127.0.0.1:8000/api/products/${id}/`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
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
            // --- 1. Obtén el token del localStorage ---
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                alert("Por favor, inicia sesión para chatear.");
                navigate('/auth');
                return;
            }

            // --- 2. Haz la llamada POST con el token en las cabeceras ---
            const res = await axios.post('http://127.0.0.1:8000/api/chat/start/', 
                { participant_id: product.owner }, // El cuerpo de la petición
                { // La configuración de la petición
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            const conversationId = res.data.id;
            navigate(`/chat/${conversationId}`);

        } catch (err) {
            console.error("Error al iniciar la conversación", err);
            alert("Hubo un error al iniciar el chat. Inténtalo de nuevo.");
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