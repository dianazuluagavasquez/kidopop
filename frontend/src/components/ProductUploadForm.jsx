// frontend/src/components/ProductUploadForm.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LocationSearchInput from './LocationSearchInput';
import './ProductUploadForm.scss';

const ProductUploadForm = ({ productToEdit = null, onFormSubmit }) => {
    const isEditMode = productToEdit !== null;

    const [formData, setFormData] = useState({
        title: '', description: '', price: '', brand: '', condition: 'new',
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [locationData, setLocationData] = useState({
        text: '', lat: null, lon: null
    });
    const [geolocationAttempted, setGeolocationAttempted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/products/categories/');
                setCategories(res.data);
            } catch (err) {
                console.error("No se pudieron cargar las categorías", err);
            }
        };
        fetchCategories();

        if (isEditMode) {
            setFormData({
                title: productToEdit.title,
                description: productToEdit.description,
                price: productToEdit.price,
                brand: productToEdit.brand || '',
                condition: productToEdit.condition,
            });
            setLocationData({
                text: productToEdit.location_text || '',
                lat: productToEdit.latitude,
                lon: productToEdit.longitude
            });
            setGeolocationAttempted(true);
            const categoryIds = productToEdit.categories.map(cat => cat.id.toString());
            setSelectedCategories(categoryIds);
            if (productToEdit.image) {
                setImagePreview(`http://127.0.0.1:8000${productToEdit.image}`);
            }
        } else {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    
                    // Usamos la misma lógica robusta para limpiar la dirección
                    handleLocationSelect({
                        text: data.display_name,
                        lat: latitude,
                        lon: longitude,
                        address: data.address
                    });
                    setGeolocationAttempted(true);
                },
                (error) => {
                    console.error("Geolocalización denegada:", error);
                    setGeolocationAttempted(true);
                }
            );
        }
    }, [productToEdit, isEditMode]);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onFileChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };
    const onCategoryChange = (e) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedCategories(value);
    };

    // --- FUNCIÓN CORREGIDA Y ROBUSTA ---
    const handleLocationSelect = (selectedLocation) => {
        let cleanText = selectedLocation.text; // Usamos el texto completo como fallback

        // Intentamos construir la dirección limpia solo si 'address' existe
        if (selectedLocation.address) {
            const { address } = selectedLocation;
            const city = address.city || address.town || address.village || '';
            const state = address.state || '';
            const country = address.country || '';
            
            const parts = [city, state, country].filter(Boolean); // Filtra partes vacías
            if (parts.length > 0) {
                cleanText = parts.join(', ');
            }
        }
        
        setLocationData({
            text: cleanText,
            lat: selectedLocation.lat,
            lon: selectedLocation.lon
        });
    };
    
    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const uploadData = new FormData();
        uploadData.append('title', formData.title);
        uploadData.append('description', formData.description);
        uploadData.append('price', formData.price);
        uploadData.append('brand', formData.brand);
        uploadData.append('condition', formData.condition);
        selectedCategories.forEach(catId => uploadData.append('category_ids', catId));
        if (image) {
            uploadData.append('image', image, image.name);
        }
        
        uploadData.append('location_text', locationData.text);
        if (locationData.lat && locationData.lon) {
            uploadData.append('latitude', parseFloat(locationData.lat).toFixed(6));
            uploadData.append('longitude', parseFloat(locationData.lon).toFixed(6));
        }

        try {
            const res = isEditMode
                ? await api.patch(`/products/${productToEdit.id}/`, uploadData)
                : await api.post('/products/', uploadData);
            
            setMessage(isEditMode ? '¡Producto actualizado con éxito!' : '¡Producto subido con éxito!');
            if (onFormSubmit) onFormSubmit(res.data);
        } catch (err) {
            setMessage('Hubo un error al guardar. Revisa los campos.');
            console.error("Error al guardar:", err.response ? err.response.data : err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h3>{isEditMode ? 'Editar Producto' : 'Vender un Producto'}</h3>
            <form onSubmit={onSubmit} className="product-form">
                
                <div className="form-group">
                    <label htmlFor="title">Título</label>
                    <input id="title" type="text" name="title" value={formData.title} onChange={onChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Descripción</label>
                    <textarea id="description" name="description" value={formData.description} onChange={onChange} required />
                </div>

                <div className="form-group-inline">
                    <div className="form-group">
                        <label htmlFor="price">Precio (€)</label>
                        <input id="price" type="number" name="price" value={formData.price} onChange={onChange} step="0.01" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="brand">Marca (opcional)</label>
                        <input id="brand" type="text" name="brand" value={formData.brand} onChange={onChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="condition">Condición</label>
                    <select id="condition" name="condition" value={formData.condition} onChange={onChange}>
                        <option value="new">Nuevo</option>
                        <option value="used">Usado</option>
                        <option value="acceptable">Aceptable</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="categories">Categorías</label>
                    <select id="categories" multiple={true} onChange={onCategoryChange} value={selectedCategories} className="category-select">
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                
                <div className="form-group">
                    <label htmlFor="location">Ubicación</label>
                    {geolocationAttempted ? (
                        <LocationSearchInput
                            onLocationSelect={handleLocationSelect}
                            initialValue={locationData.text}
                        />
                    ) : (
                        <p>Detectando tu ubicación...</p>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="image">Imagen del Producto</label>
                    {imagePreview && <img src={imagePreview} alt="Previsualización" className="image-preview"/>}
                    <input id="image" type="file" accept="image/*" onChange={onFileChange} />
                </div>

                <button type="submit" disabled={loading} className="submit-button">
                    {loading ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Subir Producto')}
                </button>
            </form>
            {message && <p className="form-message">{message}</p>}
        </div>
    );
};

export default ProductUploadForm;