// frontend/src/components/ProductList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import ProductCard from './ProductCard';
import FilterBar from './FilterBar';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // --- 1. ESTADOS SEPARADOS PARA CADA FILTRO ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // --- 2. EFECTO "DEBOUNCE" PARA LA BÚSQUEDA ---
    // Solo actualiza el término de búsqueda para la API 500ms después de que dejas de escribir.
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // Espera medio segundo

        return () => {
            clearTimeout(timerId); // Limpia el temporizador si vuelves a escribir
        };
    }, [searchTerm]);

    // --- 3. LA LLAMADA A LA API AHORA DEPENDE DE LOS FILTROS SEPARADOS ---
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (debouncedSearchTerm) {
                params.append('search', debouncedSearchTerm);
            }
            if (selectedCategory) {
                params.append('category', selectedCategory);
            }

            const res = await api.get(`/products/?${params.toString()}`);
            setProducts(res.data);
        } catch (err) {
            setError('No se pudieron cargar los productos.');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm, selectedCategory]); // Se ejecuta si cambia la búsqueda o la categoría

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div>
            <h2>Encuentra lo que buscas</h2>
            <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm} // Pasa la función para actualizar la búsqueda
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory} // Pasa la función para actualizar la categoría
            />

            {loading && <p>Cargando productos...</p>}
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