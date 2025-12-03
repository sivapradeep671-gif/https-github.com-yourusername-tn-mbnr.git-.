import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, Map as MapIcon, Filter } from 'lucide-react';
import type { Business } from '../types/types';
import { useLanguage } from '../context/LanguageContext';
import { VoiceInput } from './VoiceInput';

// Fix for default marker icon in Leaflet with Vite/Webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapExplorerProps {
    businesses: Business[];
}

export const MapExplorer: React.FC<MapExplorerProps> = ({ businesses }) => {
    const { t } = useLanguage();
    // Default center for Tamil Nadu (approx. Trichy/Central TN)
    const centerPosition: [number, number] = [10.7905, 78.7047];

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col">
            <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <MapIcon className="h-6 w-6 text-yellow-500 mr-3" />
                    <h2 className="text-xl font-bold text-white">{t.map.title}</h2>
                </div>
                <div className="flex space-x-4">
                    <div className="relative">
                        <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                        <input
                            type="text"
                            placeholder={t.map.search_placeholder}
                            className="bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-10 py-2 text-sm text-white focus:border-yellow-500 outline-none w-64"
                            id="map-search-input"
                        />
                        <div className="absolute right-2 top-1.5">
                            <VoiceInput onResult={(text) => {
                                const input = document.getElementById('map-search-input') as HTMLInputElement;
                                if (input) input.value = text;
                            }} />
                        </div>
                    </div>
                    <button className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm transition-colors">
                        <Filter className="h-4 w-4" />
                        <span>{t.map.filter}</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 relative z-0">
                <MapContainer center={centerPosition} zoom={7} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {businesses.map((business) => (
                        // For demo purposes, we are generating random coordinates around TN if not present
                        // In a real app, business.address would be geocoded
                        <Marker
                            key={business.id}
                            position={[
                                10.7905 + (Math.random() - 0.5) * 4,
                                78.7047 + (Math.random() - 0.5) * 4
                            ]}
                        >
                            <Popup>
                                <div className="p-2">
                                    <h3 className="font-bold text-slate-900">{business.tradeName}</h3>
                                    <p className="text-xs text-slate-600">{business.type}</p>
                                    <p className="text-xs text-slate-500 mt-1">{business.address}</p>
                                    <div className={`mt-2 text-xs font-bold px-2 py-1 rounded inline-block ${business.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {business.status}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};
