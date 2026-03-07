import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Map as MapIcon, Filter } from 'lucide-react';
import type { Business } from '../types/types';
import { useLanguage } from '../context/LanguageContext';
import { VoiceInput } from './VoiceInput';
import { getIconByStatus } from '../utils/mapIcons';

interface MapExplorerProps {
    businesses: Business[];
}

export const MapExplorer: React.FC<MapExplorerProps> = ({ businesses }) => {
    const { t } = useLanguage();
    // Default center for Tamil Nadu (approx. Trichy/Central TN)
    const centerPosition: [number, number] = [10.7905, 78.7047];

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col">
            <div className="bg-slate-900 border-b border-slate-800 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                <div className="flex items-center w-full sm:w-auto">
                    <MapIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 mr-2 sm:mr-3" />
                    <h2 className="text-lg sm:text-xl font-bold text-white truncate">{t.map.title}</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="relative w-full sm:w-64">
                        <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                        <input
                            type="text"
                            placeholder={t.map.search_placeholder}
                            className="bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-10 py-2 text-sm text-white focus:border-yellow-500 outline-none w-full"
                            id="map-search-input"
                        />
                        <div className="absolute right-2 top-1.5">
                            <VoiceInput onResult={(text) => {
                                const input = document.getElementById('map-search-input') as HTMLInputElement;
                                if (input) input.value = text;
                            }} />
                        </div>
                    </div>
                    <button className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm transition-colors w-full sm:w-auto">
                        <Filter className="h-4 w-4" />
                        <span>{t.map.filter}</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 relative z-0 overflow-hidden">
                <MapContainer center={centerPosition} zoom={7} scrollWheelZoom={true} style={{ height: '100%', width: '100%', minHeight: '300px' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {businesses.map((business) => {
                        const position: [number, number] | undefined = (business.latitude && business.longitude)
                            ? [business.latitude, business.longitude]
                            : business.coordinates
                                ? [business.coordinates.lat, business.coordinates.lng]
                                : (business.id.length >= 4 ? [
                                    centerPosition[0] + (parseInt(business.id.slice(-2), 16) / 256 - 0.5) * 4,
                                    centerPosition[1] + (parseInt(business.id.slice(-4, -2), 16) / 256 - 0.5) * 4
                                ] : undefined);

                        if (!position || isNaN(position[0]) || isNaN(position[1])) return null;

                        return (
                            <Marker
                                key={business.id}
                                position={position}
                                icon={getIconByStatus(business.status, business.riskScore)}
                            >
                                <Popup>
                                    <div className="p-2 min-w-[200px]">
                                        <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-2">{business.tradeName}</h3>
                                        <div className="space-y-1.5">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{business.type}</p>
                                            <p className="text-xs text-slate-600 leading-relaxed"><span className="font-medium">📍 Address:</span> {business.address}</p>
                                            <p className="text-xs text-slate-600"><span className="font-medium">📞 Contact:</span> {business.contactNumber}</p>
                                            <div className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm inline-block ${business.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {business.status.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
};
