// frontend/src/components/SearchBar.jsx
import React from 'react';
import './SearchBar.scss';

const SearchBar = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="k-seach-c">
            <input
                type="text"
                className="search-input"
                placeholder="Buscar por palabra clave..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;