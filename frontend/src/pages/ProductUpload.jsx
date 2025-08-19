// frontend/src/pages/ProductUpload.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductUpload = ({ onProductUploaded }) => {
    // --- ESTADOS DEL FORMULARIO ---
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        brand: '',
        condition: 'new',
    });
    const [image, setImage] = useState(null);
    const [locationText, setLocationText] = useState('');
    
    // --- ESTADOS DE LA INTERFAZ ---
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [locationDenied, setLocationDenied] = useState(false);

    // --- ESTADOS PARA LAS CATEGORÍAS ---
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    // --- EFECTO PARA CARGAR CATEGORÍAS ---
    // Se ejecuta una sola vez cuando el componente se monta para obtener la lista de categorías.
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/products/categories/');
                setCategories(res.data);
            } catch (err) {
                console.error("No se pudieron cargar las categorías", err);
            }
        };
        fetchCategories();
    }, []);

    const { title, description, price, brand, condition } = formData;

    // --- MANEJADORES DE CAMBIOS EN EL FORMULARIO ---
    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onFileChange = (e) => setImage(e.target.files[0]);

    // Manejador para el selector múltiple de categorías
    const onCategoryChange = (e) => {
        const options = e.target.options;
        const value = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setSelectedCategories(value);
    };

    // --- LÓGICA DE ENVÍO DEL FORMULARIO ---
    // Esta función se encarga de empaquetar y enviar los datos
    const sendData = async (locationData) => {
        const uploadData = new FormData();
        uploadData.append('title', title);
        uploadData.append('description', description);
        uploadData.append('price', price);
        uploadData.append('brand', brand);
        uploadData.append('condition', condition);
        
        // Añade la ubicación (automática o manual)
        if (locationData.latitude) {
            uploadData.append('latitude', locationData.latitude);
            uploadData.append('longitude', locationData.longitude);
        } else if (locationData.location_text) {
            uploadData.append('location_text', locationData.location_text);
        }

        if (image) {
            uploadData.append('image', image, image.name);
        }
        selectedCategories.forEach(catId => {
            uploadData.append('category_ids', catId);
        });

        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                setMessage('Debes iniciar sesión para subir un producto.');
                setLoading(false);
                return;
            }

            const res = await axios.post('http://127.0.0.1:8000/api/products/', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            setMessage('¡Producto subido con éxito!');
            if (onProductUploaded) onProductUploaded(); // Avisa al componente padre para que refresque la lista
        
        } catch (err) {
            console.error('Error al subir el producto:', err.response ? err.response.data : err);
            setMessage('Hubo un error al subir el producto. Revisa los campos.');
        } finally {
            setLoading(false);
        }
    };

    // La función que se llama al pulsar el botón
    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Si el usuario ya ha rellenado la ubicación manual, la usamos directamente
        if (locationDenied && locationText) {
            sendData({ location_text: locationText });
        } else {
            // Si no, intentamos obtener la geolocalización automática
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        latitude: position.coords.latitude.toFixed(6),
                        longitude: position.coords.longitude.toFixed(6),
                    };
                    sendData(location);
                },
                (error) => {
                    // Si falla, activamos el campo de texto manual
                    console.error("Error obteniendo la ubicación:", error);
                    setLocationDenied(true);
                    setLoading(false);
                    setMessage('Permiso de ubicación denegado. Por favor, introduce tu ubicación manualmente y pulsa "Subir" de nuevo.');
                }
            );
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
            <h3>Vender un Producto</h3>
            <form onSubmit={onSubmit}>
                <input type="text" name="title" value={title} onChange={onChange} placeholder="Título" required />
                <textarea name="description" value={description} onChange={onChange} placeholder="Descripción" required />
                <input type="number" name="price" value={price} onChange={onChange} placeholder="Precio (€)" step="0.01" required />
                <input type="text" name="brand" value={brand} onChange={onChange} placeholder="Marca (opcional)" />
                
                <select name="condition" value={condition} onChange={onChange}>
                    <option value="new">Nuevo</option>
                    <option value="used">Usado</option>
                    <option value="acceptable">Aceptable</option>
                </select>

                <label>Categorías:</label>
                <select multiple={true} onChange={onCategoryChange} value={selectedCategories}>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <label>Imagen:</label>
                <input type="file" accept="image/*" onChange={onFileChange} />
                
                {locationDenied && (
                    <input 
                        type="text" 
                        value={locationText} 
                        onChange={(e) => setLocationText(e.target.value)}
                        placeholder="Introduce tu ciudad o dirección"
                        required
                    />
                )}
                
                <button type="submit" disabled={loading}>{loading ? 'Subiendo...' : 'Subir Producto'}</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ProductUpload;