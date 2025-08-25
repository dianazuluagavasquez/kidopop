// frontend/src/components/ProductList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; 
import api from '../services/api';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar'; 
import Loader from './Loader';
// import CategoryButtons from './CategoryButtons'; 
import './ProductList.scss';

const ProductList = ({ selectedCategory, isLoggedIn }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const [useLocation, setUseLocation] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); 

        return () => {
            clearTimeout(timerId); 
        };
    }, [searchTerm]);

    useEffect(() => {
        if (useLocation) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setUserLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    (error) => {
                        console.error("Error getting user location", error);
                        setUseLocation(false);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
                setUseLocation(false);
            }
        } else {
            setUserLocation(null);
        }
    }, [useLocation]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (debouncedSearchTerm) {
                params.append('search', debouncedSearchTerm);
            }
            if (selectedCategory) params.append('category', selectedCategory);
            if (userLocation) {
                params.append('latitude', userLocation.latitude);
                params.append('longitude', userLocation.longitude);
            }

            const res = await api.get(`/products/?${params.toString()}`);
            setProducts(res.data);
        } catch (err) {
            setError('No se pudieron cargar los productos.');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm, selectedCategory, userLocation]); 

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div>  
            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />
            <button onClick={() => setUseLocation(!useLocation)}>
                {useLocation ? 'Dejar de usar mi ubicación' : 'Buscar cerca de mí'}
            </button>

            {!isLoggedIn && (
                <div className="k-c-btn">
                    <Link to="/auth" className="k-btn">Empieza a Vender Ahora</Link>
                    <Link to="/como-funciona" className="k-nav-link">¿Cómo Funciona?</Link>
                </div>
            )}

            {loading && <Loader />}
            {error && <p>{error}</p>}
            {!loading && !error && (
                <div className="product-list-grid">
                    {products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <p>No se encontraron productos que coincidan con tu búsqueda.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductList;