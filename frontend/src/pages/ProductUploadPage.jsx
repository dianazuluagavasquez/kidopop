// frontend/src/pages/ProductUploadPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
// Importamos el formulario desde la carpeta de componentes
import ProductUploadForm from '../components/ProductUploadForm.jsx';

const ProductUploadPage = () => {
    const navigate = useNavigate();

    const handleProductUploaded = () => {
        // Después de subir el producto, redirigimos al usuario a la página principal
        setTimeout(() => {
            navigate('/');
        }, 1500); // Esperamos 1.5 segundos para que el usuario vea el mensaje de éxito
    };

    return (
        <div>
            {/* La página simplemente renderiza el formulario y le pasa la función de callback */}
            <ProductUploadForm onProductUploaded={handleProductUploaded} />
        </div>
    );
};

export default ProductUploadPage;