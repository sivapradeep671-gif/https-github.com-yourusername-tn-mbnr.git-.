import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom green marker for verified businesses
const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom red marker for suspicious scans
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface Shop {
    id: string;
    name: string;
    lat: number;
    lng: number;
    total_scans: number;
    failed_scans: number;
    verified_scans: number;
}

interface SuspiciousScan {
    id: number;
    shop_name: string;
    shop_location: { lat: number; lng: number };
    scan_location: { lat: number; lng: number };
    distance: number;
    result: string;
    scanned_at: string;
}

interface AdminMapProps {
    shops: Shop[];
    suspiciousScans: SuspiciousScan[];
}

// Component to auto-fit map bounds
function MapBounds({ shops, suspiciousScans }: { shops: Shop[], suspiciousScans: SuspiciousScan[] }) {
    const map = useMap();

    useEffect(() => {
        const bounds = L.latLngBounds([]);

        shops.forEach(shop => {
            if (shop.lat && shop.lng) {
                bounds.extend([shop.lat, shop.lng]);
            }
        });

        suspiciousScans.forEach(scan => {
            if (scan.scan_location?.lat && scan.scan_location?.lng) {
                bounds.extend([scan.scan_location.lat, scan.scan_location.lng]);
            }
        });

        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50] });
        } else {
            // Default to Chennai if no valid bounds
            map.setView([13.0827, 80.2707], 12);
        }
    }, [shops, suspiciousScans, map]);

    return null;
}

export const AdminMap: React.FC<AdminMapProps> = ({ shops, suspiciousScans }) => {
    const [selectedType, setSelectedType] = useState<'all' | 'shops' | 'suspicious'>('all');

    const showShops = selectedType === 'all' || selectedType === 'shops';
    const showSuspicious = selectedType === 'all' || selectedType === 'suspicious';

    return (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-blue-500" />
                    <h2 className="text-xl font-bold text-white">Fraud Detection Map</h2>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setSelectedType('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedType === 'all'
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setSelectedType('shops')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedType === 'shops'
                                ? 'bg-green-500 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        Shops ({shops.length})
                    </button>
                    <button
                        onClick={() => setSelectedType('suspicious')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedType === 'suspicious'
                                ? 'bg-red-500 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        Suspicious ({suspiciousScans.length})
                    </button>
                </div>
            </div>

            <div className="h-[500px] rounded-xl overflow-hidden border border-slate-800">
                <MapContainer
                    center={[13.0827, 80.2707]}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapBounds shops={shops} suspiciousScans={suspiciousScans} />

                    {/* Registered Shops (Green Markers) */}
                    {showShops && shops.map((shop) => (
                        shop.lat && shop.lng && (
                            <Marker
                                key={`shop-${shop.id}`}
                                position={[shop.lat, shop.lng]}
                                icon={greenIcon}
                            >
                                <Popup>
                                    <div className="p-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <h3 className="font-bold text-sm">{shop.name}</h3>
                                        </div>
                                        <p className="text-xs text-slate-600 mb-1">ID: {shop.id}</p>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <div className="bg-green-50 p-2 rounded">
                                                <p className="text-[10px] text-slate-500">Verified</p>
                                                <p className="text-sm font-bold text-green-600">{shop.verified_scans}</p>
                                            </div>
                                            <div className="bg-red-50 p-2 rounded">
                                                <p className="text-[10px] text-slate-500">Failed</p>
                                                <p className="text-sm font-bold text-red-600">{shop.failed_scans}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    ))}

                    {/* Suspicious Scans (Red Markers) */}
                    {showSuspicious && suspiciousScans.map((scan) => (
                        scan.scan_location?.lat && scan.scan_location?.lng && (
                            <Marker
                                key={`scan-${scan.id}`}
                                position={[scan.scan_location.lat, scan.scan_location.lng]}
                                icon={redIcon}
                            >
                                <Popup>
                                    <div className="p-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertTriangle className="h-4 w-4 text-red-500" />
                                            <h3 className="font-bold text-sm text-red-600">Suspicious Scan</h3>
                                        </div>
                                        <p className="text-xs font-bold mb-1">{scan.shop_name}</p>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-slate-600">
                                                <span className="font-bold">Result:</span> {scan.result}
                                            </p>
                                            {scan.distance && (
                                                <p className="text-[10px] text-red-600 font-bold">
                                                    Distance: {scan.distance.toFixed(2)}km away
                                                </p>
                                            )}
                                            <p className="text-[10px] text-slate-500">
                                                {new Date(scan.scanned_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    ))}
                </MapContainer>
            </div>

            <div className="mt-4 flex items-center justify-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-400">Registered Businesses</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-slate-400">Suspicious Scans</span>
                </div>
            </div>
        </div>
    );
};
