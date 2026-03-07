const express = require('express');
const router = express.Router();
const db = require('./database.cjs');
const { Blockchain, Block } = require('./blockchain.cjs');
const { calculateLicenseTimestamps } = require('./licenseStatus.cjs');

router.post('/seed', (req, res) => {
    console.log("Seeding Demo Data...");

    // 1. Clear existing business data
    db.run("DELETE FROM businesses", [], (err) => {
        if (err) return res.status(500).json({ error: "Failed to clear businesses" });

        db.run("DELETE FROM scans", [], (err) => {
            if (err) return res.status(500).json({ error: "Failed to clear scans" });

            // 2. Insert Demo Shops
            const demoShops = [
                {
                    id: 'DEMO-001',
                    legalName: 'Sri Krishna Sweets Pvt Ltd',
                    tradeName: 'Sri Krishna Sweets',
                    type: 'Private Limited',
                    category: 'Food & Beverage',
                    address: '123, M.G. Road, Adyar, Chennai', // 13.0067, 80.2496
                    proofOfAddress: 'demo_proof_1.jpg',
                    branchName: 'Adyar Branch',
                    contactNumber: '9876543210',
                    email: 'contact@srikrishnasweets.com',
                    gstNumber: '33AAACS1234D1Z5',
                    status: 'Verified',
                    registrationDate: '2023-01-15',
                    riskScore: 5,
                    latitude: 13.0067,
                    longitude: 80.2496
                },
                {
                    id: 'DEMO-002',
                    legalName: 'A2B Adyar Ananda Bhavan',
                    tradeName: 'A2B',
                    type: 'Private Limited',
                    category: 'Food & Beverage',
                    address: '45, Anna Salai, T. Nagar, Chennai', // 13.0418, 80.2341
                    proofOfAddress: 'demo_proof_2.jpg',
                    branchName: 'T. Nagar Branch',
                    contactNumber: '9876543211',
                    email: 'info@a2b.com',
                    gstNumber: '33BBBCS5678E2Z6',
                    status: 'Verified',
                    registrationDate: '2023-02-20',
                    riskScore: 2,
                    latitude: 13.0418,
                    longitude: 80.2341
                },
                {
                    id: 'DEMO-003',
                    legalName: 'KPN Travels India Pvt Ltd',
                    tradeName: 'KPN Travels',
                    type: 'Private Limited',
                    category: 'Transportation',
                    address: '12, Omni Bus Stand, Koyambedu, Chennai', // 13.0694, 80.1914
                    proofOfAddress: 'demo_proof_3.jpg',
                    branchName: 'Head Office',
                    contactNumber: '044-24791111',
                    email: 'bookings@kpntravels.in',
                    gstNumber: '33CCCCS9012F3Z7',
                    status: 'Verified',
                    registrationDate: '2022-05-10',
                    riskScore: 3,
                    latitude: 13.0694,
                    longitude: 80.1914
                }
            ];

            const stmt = db.prepare(`INSERT INTO businesses (
                id, legalName, tradeName, type, category, address, proofOfAddress, branchName, 
                contactNumber, email, gstNumber, status, registrationDate, riskScore, latitude, longitude,
                license_valid_till, grace_ends_at, pay_by_date, payment_done, license_status
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);

            demoShops.forEach(shop => {
                const ts = calculateLicenseTimestamps(shop.registrationDate);
                stmt.run(
                    shop.id, shop.legalName, shop.tradeName, shop.type, shop.category, shop.address, shop.proofOfAddress, shop.branchName,
                    shop.contactNumber, shop.email, shop.gstNumber, shop.status, shop.registrationDate, shop.riskScore, shop.latitude, shop.longitude,
                    ts.license_valid_till, ts.grace_ends_at, ts.pay_by_date, ts.payment_done, ts.license_status
                );
            });

            stmt.finalize();
            console.log("Seeded 3 demo shops.");
            res.json({ message: "Demo data loaded successfully", count: demoShops.length });
        });
    });
});

module.exports = router;
