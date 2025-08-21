// frontend/src/pages/ProductEditPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductUploadForm from '../components/ProductUploadForm';

const ProductEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}/`);
                setProduct(res.data);
            } catch (err) {
                console.error("Error al cargar el producto para editar", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleFormSubmit = (updatedProduct) => {
        // Después de editar, redirigimos a la página de perfil
        setTimeout(() => navigate('/profile'), 1500);
    };

    if (loading) return <p>Cargando producto...</p>;
    if (!product) return <p>Producto no encontrado o no tienes permiso para editarlo.</p>;

    return (
        <div>
            <ProductUploadForm 
                productToEdit={product} 
                onFormSubmit={handleFormSubmit} 
            />
        </div>
    );
};

export default ProductEditPage;