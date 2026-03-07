const crypto = require('crypto');

const QR_SECRET_KEY = 'tn-mbnr-trust-key-2024';

const signData = (data) => {
    return crypto.createHmac('sha256', QR_SECRET_KEY).update(JSON.stringify(data)).digest('hex');
};

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
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

const verify = (token, scannerLocation) => {
    try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
        const { payload, signature } = decoded;

        if (signature !== signData(payload)) return { status: 'COUNTERFEIT' };
        if (Date.now() > payload.exp) return { status: 'EXPIRED' };

        if (scannerLocation) {
            const distance = getDistanceFromLatLonInKm(payload.lat, payload.lng, scannerLocation.lat, scannerLocation.lng);
            if (distance > 0.2) return { status: 'LOCATION_MISMATCH', distance };
        }

        return { status: 'VALID' };
    } catch (e) {
        return { status: 'INVALID' };
    }
};

console.log("Starting Verification Logic Tests...");

const testBusiness = { id: 'TEST-1', name: 'Test Store', lat: 13.0827, lng: 80.2707 };
const now = Date.now();

// Tokens
const payload1 = { ...testBusiness, exp: now + 30000, nonce: '1' };
const token1 = Buffer.from(JSON.stringify({ payload: payload1, signature: signData(payload1) })).toString('base64');

const payload4 = { ...testBusiness, exp: now - 1000, nonce: '4' };
const token4 = Buffer.from(JSON.stringify({ payload: payload4, signature: signData(payload4) })).toString('base64');

const token5 = Buffer.from(JSON.stringify({ payload: payload1, signature: 'wrong-sig' })).toString('base64');

// Results
const results = [
    { name: "Valid Token", pass: verify(token1, { lat: 13.0827, lng: 80.2707 }).status === 'VALID' },
    { name: "Within Range (100m)", pass: verify(token1, { lat: 13.083, lng: 80.271 }).status === 'VALID' },
    { name: "Far Away (2km)", pass: verify(token1, { lat: 13.1, lng: 80.3 }).status === 'LOCATION_MISMATCH' },
    { name: "Expired Token", pass: verify(token4, { lat: 13.0827, lng: 80.2707 }).status === 'EXPIRED' },
    { name: "Counterfeit Token", pass: verify(token5, { lat: 13.0827, lng: 80.2707 }).status === 'COUNTERFEIT' }
];

results.forEach(r => console.log(`${r.name}: ${r.pass ? 'PASS' : 'FAIL'}`));

if (results.every(r => r.pass)) {
    console.log("----------------------------");
    console.log("ALL LOGIC TESTS PASSED (1-5)");
    console.log("----------------------------");
} else {
    console.log("SOME TESTS FAILED");
    process.exit(1);
}
