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
    // const [selectedCategory, setSelectedCategory] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); 

        return () => {
            clearTimeout(timerId); 
        };
    }, [searchTerm]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (debouncedSearchTerm) {
                params.append('search', debouncedSearchTerm);
            }
            if (selectedCategory) params.append('category', selectedCategory);

            const res = await api.get(`/products/?${params.toString()}`);
            setProducts(res.data);
        } catch (err) {
            setError('No se pudieron cargar los productos.');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm, selectedCategory]); 

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div>  
            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />

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