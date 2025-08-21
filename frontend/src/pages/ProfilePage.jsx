// frontend/src/pages/ProfilePage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal'; // <-- 1. Importa el Modal
import './ProfilePage.scss';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // --- 2. Estados para controlar el Modal ---
    const [modalState, setModalState] = useState({
        isOpen: false,
        action: null, // 'sold' o 'delete'
        productId: null,
        productTitle: ''
    });

    const fetchProfile = useCallback(async () => {
        try {
            const res = await api.get('/profile/');
            setProfile(res.data);
        } catch (err) {
            setError("No se pudo cargar tu perfil.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // --- 3. Funciones que abren el Modal ---
    const openModalForSold = (productId, productTitle) => {
        setModalState({ isOpen: true, action: 'sold', productId, productTitle });
    };

    const openModalForDelete = (productId, productTitle) => {
        setModalState({ isOpen: true, action: 'delete', productId, productTitle });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, action: null, productId: null, productTitle: '' });
    };

    // --- 4. Función que se ejecuta al confirmar en el Modal ---
    const handleConfirmAction = async () => {
        const { action, productId } = modalState;
        try {
            if (action === 'sold') {
                await api.patch(`/products/${productId}/`, { status: 'sold' });
            } else if (action === 'delete') {
                await api.delete(`/products/${productId}/`);
            }
            fetchProfile(); // Recarga los datos
        } catch (err) {
            alert(`Hubo un error al realizar la acción.`);
        } finally {
            closeModal(); // Cierra el modal en cualquier caso
        }
    };

    if (loading) return <p>Cargando perfil...</p>;
    if (error) return <p>{error}</p>;
    if (!profile) return null;

    return (
        <>
            <Modal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                onConfirm={handleConfirmAction}
                title={modalState.action === 'sold' ? 'Confirmar Venta' : 'Confirmar Eliminación'}
            >
                <p>
                    ¿Estás seguro de que quieres {modalState.action === 'sold' ? 'marcar como vendido' : 'eliminar permanentemente'} el producto:
                    <strong> "{modalState.productTitle}"</strong>?
                </p>
            </Modal>

            <div className="profile-page">
                <div className="profile-header">
                    <h2>Hola, {profile.username}!</h2>
                    <p>Gestiona los artículos que tienes a la venta.</p>
                </div>
                <div className="profile-products-section">
                    <h3>Tus artículos</h3>
                    {profile.products && profile.products.length > 0 ? (
                        <div className="product-list-grid">
                            {profile.products.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product}
                                    isOwnerView={true}
                                    onMarkAsSold={openModalForSold}
                                    onDelete={openModalForDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <p>Aún no has subido ningún producto. <a href="/upload-product">¡Vende tu primer artículo!</a></p>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProfilePage;