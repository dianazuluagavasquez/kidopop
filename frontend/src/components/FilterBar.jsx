// frontend/src/components/FilterBar.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './FilterBar.css';

// El componente ahora recibe más props para funcionar
const FilterBar = ({ searchTerm, onSearchChange, selectedCategory, onCategoryChange }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/products/categories/');
                setCategories(res.data);
            } catch (err) {
                console.error("Error al cargar categorías", err);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="filter-bar">
            <input
                type="text"
                className="search-input"
                placeholder="Buscar por palabra clave..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)} // Llama a la función del padre
            />
            <select
                className="category-select"
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)} // Llama a la función del padre
            >
                <option value="">Todas las categorías</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
        </div>
    );
};

export default FilterBar;