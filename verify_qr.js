
const BASE_URL = 'http://127.0.0.1:3001';

async function runVerification() {
    console.log("🚀 Starting Dynamic QR & Geofencing Verification (ESM with Fetch)...");

    try {
        // 1. Create a Test Business
        console.log("\n1️⃣ Creating Test Business...");
        const businessData = {
            id: `TEST-BIZ-${Date.now()}`,
            legalName: "Test Bakery",
            tradeName: "Best Bakes",
            type: "Food",
            category: "Bakery",
            address: "123 Test St",
            proofOfAddress: "doc_123",
            branchName: "Main",
            contactNumber: "9999999999",
            email: "test@example.com",
            gstNumber: "GST123",
            status: "Active",
            registrationDate: new Date().toISOString(),
            riskScore: 10,
            latitude: 13.0827,
            longitude: 80.2707
        };

        const createRes = await fetch(`${BASE_URL}/api/businesses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(businessData)
        });

        if (!createRes.ok) {
            const errText = await createRes.text();
            throw new Error(`Create Business failed: ${createRes.status} - ${errText}`);
        }
        console.log(`✅ Business Created: ${businessData.tradeName} (${businessData.id})`);

        // 2. Generate Dynamic QR Token
        console.log("\n2️⃣ Fetching Dynamic QR Token...");
        const tokenRes = await fetch(`${BASE_URL}/api/qr-token/${businessData.id}`);
        if (!tokenRes.ok) throw new Error(`Get Token failed: ${tokenRes.status}`);
        const tokenData = await tokenRes.json();
        const token = tokenData.token;
        console.log("✅ Token Received");

        // 3. Verify Valid Scan (Matching Location)
        console.log("\n3️⃣ Verifying Valid Scan (Correct Location)...");
        const validScanRes = await fetch(`${BASE_URL}/api/verify-scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token,
                scannerLocation: { lat: 13.0827, lng: 80.2707 } // Exact match
            })
        });
        const validScanData = await validScanRes.json();
        console.log("Response:", validScanData);
        if (validScanData.status === 'VALID') {
            console.log("✅ Valid Scan Verified");
        } else {
            console.error("❌ Valid Scan Failed");
        }

        // 4. Verify Geofence Mismatch (Far Location)
        console.log("\n4️⃣ Verifying Geofence Mismatch (Far Location)...");
        const farScanRes = await fetch(`${BASE_URL}/api/verify-scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token,
                scannerLocation: { lat: 13.1, lng: 80.3 } // Far away
            })
        });
        const farScanData = await farScanRes.json();
        console.log("Response:", farScanData);
        if (farScanData.status === 'LOCATION_MISMATCH') {
            console.log("✅ Geofence Check Verified");
        } else {
            console.error("❌ Geofence Check Failed");
        }

        // 5. Verify Expiry (Wait 31s)
        console.log("\n5️⃣ Verifying Token Expiry (Waiting 31s)...");
        await new Promise(resolve => setTimeout(resolve, 31000));

        const expiredScanRes = await fetch(`${BASE_URL}/api/verify-scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token,
                scannerLocation: { lat: 13.0827, lng: 80.2707 }
            })
        });
        const expiredScanData = await expiredScanRes.json();
        console.log("Response:", expiredScanData);
        if (expiredScanData.status === 'EXPIRED') {
            console.log("✅ Expiry Check Verified");
        } else {
            console.error("❌ Expiry Check Failed");
        }

    } catch (error) {
        console.error("❌ Error running verification:", error.message);
    }
}

runVerification();
