// frontend/src/components/CategoryButtons.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './CategoryButtons.scss';

const CategoryButtons = ({ selectedCategory, onCategoryChange }) => {
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
        <div className="k-cat-btn-c k-c">
            <button
                onClick={() => onCategoryChange('')}
                className={`k-cat-btn-c__btn ${selectedCategory === '' ? 'active' : ''}`}
            >
                Todas
            </button>
            {categories.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => onCategoryChange(cat.id.toString())}
                    className={`k-cat-btn-c__btn ${selectedCategory === cat.id.toString() ? 'active' : ''}`}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
};

export default CategoryButtons;