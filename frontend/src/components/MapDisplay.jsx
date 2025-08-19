// frontend/src/components/MapDisplay.jsx

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapDisplay = ({ lat, lon, text }) => {
    // Si no hay coordenadas válidas, no renderiza el mapa.
    if (!lat || !lon) {
        return null;
    }

    const position = [lat, lon];

    return (
        <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
            <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                    <Popup>
                        {text || 'Ubicación aproximada del producto'}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapDisplay;