// frontend/src/components/LocationSearchInput.jsx

import React, { useState } from 'react';
//import './LocationSearchInput.css';

const LocationSearchInput = ({ onLocationSelect, initialValue = '' }) => {
    const [query, setQuery] = useState(initialValue);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length < 3) {
            setResults([]);
            return;
        }

        setLoading(true);
        // Hacemos la llamada a la API de Nominatim de OpenStreetMap
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`);
        const data = await response.json();
        setResults(data);
        setLoading(false);
    };

    const handleResultClick = (result) => {
        // Cuando el usuario selecciona un resultado...
        setQuery(result.display_name); // Actualizamos el input con el nombre completo
        setResults([]); // Ocultamos la lista de resultados
        // Enviamos los datos importantes al componente padre (el formulario)
         onLocationSelect({
        text: result.display_name, // Mantenemos el texto largo para el input
        lat: result.lat,
        lon: result.lon,
        address: result.address // <-- ¡NUEVO! Pasamos el objeto de dirección
    });
    };

    return (
        <div className="location-search-container">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Empieza a escribir una dirección..."
            />
            {loading && <p>Buscando...</p>}
            {results.length > 0 && (
                <ul className="location-results-list">
                    {results.map(result => (
                        <li key={result.place_id} onClick={() => handleResultClick(result)}>
                            {result.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LocationSearchInput;