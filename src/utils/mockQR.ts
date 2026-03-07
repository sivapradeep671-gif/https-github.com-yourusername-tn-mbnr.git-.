import CryptoJS from 'crypto-js';

// Shared secret for demo purposes (mirrors backend)
const MOCK_SECRET_KEY = 'tn-mbnr-trust-key-2024';

// Helper: Calculate Distance
export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Helper: Sign Data (HMAC SHA256)
export const signData = (data: any) => {
    return CryptoJS.HmacSHA256(JSON.stringify(data), MOCK_SECRET_KEY).toString(CryptoJS.enc.Hex);
};

// 1. Mock Generate Token
export const generateMockToken = (businessId: string) => {
    // Mock Business Location (Chennai)
    const mockBusiness = {
        id: businessId,
        name: businessId === 'MBNR-2024-8821' ? 'Madurai Spices Pvt Ltd' : 'Verified Business',
        lat: 13.0827,
        lng: 80.2707,
    };

    const payload = {
        id: mockBusiness.id,
        name: mockBusiness.name,
        lat: mockBusiness.lat,
        lng: mockBusiness.lng,
        exp: Date.now() + 30000,
        nonce: Math.random().toString(36).substring(7)
    };

    const signature = signData(payload);
    return btoa(JSON.stringify({ payload, signature })); // Base64 encode
};

// 2. Mock Verify Function
export const verifyMockToken = (token: string, scannerLocation: { lat: number, lng: number }) => {
    try {
        const decoded = JSON.parse(atob(token));
        const { payload, signature } = decoded;

        // 1. Verify Signature
        const expectedSignature = signData(payload);
        if (signature !== expectedSignature) {
            return { status: 'COUNTERFEIT', message: 'Invalid QR Signature (Demo)' };
        }

        // 2. Verify Expiry
        if (Date.now() > payload.exp) {
            return { status: 'EXPIRED', message: 'QR Code Expired (Demo)' };
        }

        // 3. Geofence Check
        if (scannerLocation) {
            const distance = getDistanceFromLatLonInKm(
                payload.lat, payload.lng,
                scannerLocation.lat, scannerLocation.lng
            );

            if (distance > 0.2) {
                return {
                    status: 'LOCATION_MISMATCH',
                    message: `Scanner is ${distance.toFixed(2)}km away. (Demo)`,
                    distance
                };
            }
        }

        return {
            status: 'VALID',
            business: { name: payload.name, id: payload.id },
            message: 'Verified Successfully (Demo Mode)'
        };

    } catch (e) {
        return { status: 'INVALID', message: 'Malformed Token' };
    }
};
