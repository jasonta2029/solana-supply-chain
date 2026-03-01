import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js + Leaflet
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

interface MapProps {
    lat: number;
    lon: number;
    label?: string;
}

const MapComponent: React.FC<MapProps> = ({ lat, lon, label }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <div className="h-full min-h-[300px] w-full bg-muted/30 rounded-2xl animate-pulse flex items-center justify-center">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Initializing Cartography...</span>
        </div>
    );

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border border-border group relative">
            <MapContainer
                center={[lat, lon]}
                zoom={13}
                style={{ height: '100%', width: '100%', zIndex: 10 }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="map-tiles"
                />
                <Marker position={[lat, lon]} icon={icon}>
                    {label && <Popup className="font-sans font-semibold">{label}</Popup>}
                </Marker>
            </MapContainer>

            {/* Overlay Gradient for depth */}
            <div className="absolute inset-0 pointer-events-none z-20 ring-1 ring-inset ring-black/5 rounded-2xl" />

            <style jsx global>{`
                .leaflet-container {
                    background: #f8fafc !important;
                }
                .leaflet-layer {
                    filter: grayscale(100%) brightness(1.1) contrast(1.1) opacity(0.8);
                }
                .leaflet-control-zoom {
                    border: none !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                }
                .leaflet-control-zoom-in, 
                .leaflet-control-zoom-out {
                    background-color: white !important;
                    color: #0f172a !important;
                    border: 1px solid #e2e8f0 !important;
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 12px !important;
                    padding: 4px !important;
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1) !important;
                }
            `}</style>
        </div>
    );
};

export default MapComponent;
