import L from 'leaflet';

// SVG Icons as Data URIs
const createIconUrl = (color: string) => {
    return `data:image/svg+xml;charset=utf-8,
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
        <path fill="${color}" stroke="white" stroke-width="1.5" d="M12.5 0C5.596 0 0 5.596 0 12.5c0 1.886.417 3.668 1.157 5.275L12.5 41l11.343-23.225C24.583 16.168 25 14.386 25 12.5 25 5.596 19.404 0 12.5 0z"/>
        <circle fill="white" cx="12.5" cy="12.5" r="4.5"/>
    </svg>`;
};

const iconShadow = 'leaflet/dist/images/marker-shadow.png';

export const Icons = {
    Verified: L.icon({
        iconUrl: createIconUrl('%2322c55e'), // Green-500
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }),
    Suspicious: L.icon({
        iconUrl: createIconUrl('%23ef4444'), // Red-500
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }),
    Warning: L.icon({
        iconUrl: createIconUrl('%23eab308'), // Yellow-500
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }),
    Default: L.icon({
        iconUrl: createIconUrl('%233b82f6'), // Blue-500
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    })
};

export const getIconByStatus = (status: string, riskScore: number = 0) => {
    if (status === 'Verified' || status === 'Valid') return Icons.Verified;
    if (riskScore > 7) return Icons.Suspicious;
    if (status === 'Expired' || status === 'Pending') return Icons.Warning;
    return Icons.Default;
};
