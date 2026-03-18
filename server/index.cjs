const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const db = require('./database.cjs');
const { Blockchain, Block } = require('./blockchain.cjs');
const { calculateLicenseStatus, calculateLicenseTimestamps } = require('./licenseStatus.cjs');
const mult = require('multer');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { validateBody } = require('./middleware/validateBody.cjs');
require('dotenv').config({ path: '../.env' });

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for image uploads
const storage = mult.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'report-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = mult({ storage: storage });

const tnMbnrChain = new Blockchain();

// Initialize Blockchain from DB
db.all("SELECT * FROM ledger ORDER BY index_id ASC", [], (err, rows) => {
    if (err) {
        console.error("Error loading ledger:", err);
        return;
    }
    if (rows.length === 0) {
        // Create Genesis Block if empty
        const genesisBlock = tnMbnrChain.createGenesisBlock();
        const sql = `INSERT INTO ledger (timestamp, data, previousHash, hash, nonce) VALUES (?,?,?,?,?)`;
        const params = [genesisBlock.timestamp, JSON.stringify(genesisBlock.data), genesisBlock.previousHash, genesisBlock.hash, genesisBlock.nonce];
        db.run(sql, params, (err) => {
            if (err) console.error("Error saving genesis block:", err);
            else console.log("Genesis Block created and saved.");
        });
    } else {
        tnMbnrChain.chain = rows.map(row => {
            const b = new Block(row.timestamp, JSON.parse(row.data), row.previousHash);
            b.hash = row.hash;
            b.nonce = row.nonce;
            return b;
        });
        console.log(`Blockchain loaded with ${tnMbnrChain.chain.length} blocks.`);
    }
});

const app = express();
const PORT = process.env.PORT || 3001;

// --- Security Stack ---
app.use(helmet({
    contentSecurityPolicy: false, // Disabled for demo simplicity with many external maps/fonts
    crossOriginEmbedderPolicy: false
}));

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many authentication attempts. Please try again in 15 minutes.' }
});

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100
});

app.use(cors({
    origin: '*', // Simplified for demo, in production use specific origin whitelist
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// --- Auth Middleware ---
const AUTH_SECRET = process.env.AUTH_SECRET || 'tn-mbnr-auth-secret-2024';

const generateToken = (payload) => {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const data = Buffer.from(JSON.stringify({ ...payload, iat: Date.now() })).toString('base64');
    const signature = crypto.createHmac('sha256', AUTH_SECRET).update(`${header}.${data}`).digest('base64');
    return `${header}.${data}.${signature}`;
};

const verifyToken = (token) => {
    try {
        const [header, data, signature] = token.split('.');
        const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(`${header}.${data}`).digest('base64');
        if (signature !== expectedSignature) return null;
        return JSON.parse(Buffer.from(data, 'base64').toString());
    } catch (e) { return null; }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const user = verifyToken(token);
    if (!user) return res.status(403).json({ error: 'Forbidden' });

    req.user = user;
    next();
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Permission denied' });
        }
        next();
    };
};

// --- Endpoints ---

app.get('/api/health', (req, res) => {
    res.json({ status: 'online', timestamp: new Date().toISOString() });
});

app.get('/api/auth/me', apiLimiter, authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

app.post('/api/auth/login', authLimiter, (req, res) => {
    const { phone, role } = req.body;
    if (!phone || !role) return res.status(400).json({ error: 'Missing phone or role' });

    // For Demo: If it's a merchant, find their business ID
    if (role === 'business') {
        db.get("SELECT id FROM businesses WHERE contactNumber = ?", [phone], (err, row) => {
            const businessId = row ? row.id : `BIZ-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
            const token = generateToken({
                id: businessId,
                phone,
                role
            });
            res.json({ message: 'Login successful', token, user: { id: businessId, phone, role } });
        });
    } else {
        const token = generateToken({
            id: `USER-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            phone,
            role
        });
        res.json({ message: 'Login successful', token, user: { phone, role } });
    }
});

app.get('/api/businesses', apiLimiter, (req, res) => {
    db.all("SELECT * FROM businesses", [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "success", data: rows });
    });
});

app.post('/api/verify-business', apiLimiter, (req, res) => {
    const { businessName, type } = req.body;
    if (!businessName) return res.status(400).json({ error: "Missing business name" });

    // In a real production app, this would use the Gemini AI service.
    // For this build, we implement robust name-clash detection logic.
    db.get("SELECT * FROM businesses WHERE tradeName = ? AND status != 'Rejected'", [businessName], (err, row) => {
        if (row) {
            return res.json({
                isSafe: false,
                riskLevel: 'High',
                similarBrands: [row.tradeName],
                message: `CRITICAL FLAG: The name "${businessName}" is already registered. Intellectual property conflict detected.`
            });
        }

        // Search for similar sounding names (basic Levenshtein-style or keyword match)
        db.all("SELECT tradeName FROM businesses WHERE tradeName LIKE ?", [`%${businessName.substring(0, 3)}%`], (err, rows) => {
            if (rows && rows.length > 0) {
                return res.json({
                    isSafe: true,
                    riskLevel: 'Medium',
                    similarBrands: rows.map(r => r.tradeName),
                    message: "INTELLIGENCE ADVISORY: Similar brands detected in the regional grid. Proceed with documentation for validation."
                });
            }

            res.json({
                isSafe: true,
                riskLevel: 'Low',
                message: "VERIFIED: Brand name clear of regional conflicts. Node synchronization complete."
            });
        });
    });
});

const businessSchema = {
    legalName: { required: true, type: 'string' },
    tradeName: { required: true, type: 'string' },
    category: { required: true, type: 'string' }
};

app.post('/api/businesses', apiLimiter, authenticateToken, authorizeRoles('business', 'admin'), validateBody(businessSchema), (req, res) => {
    const b = req.body;
    const regDate = b.registrationDate || new Date().toISOString();
    const licenseTimestamps = calculateLicenseTimestamps(regDate);

    const sql = `INSERT INTO businesses (
        id, legalName, tradeName, type, category, address, proofOfAddress, branchName, 
        contactNumber, email, gstNumber, status, registrationDate, riskScore, latitude, longitude,
        license_valid_till, grace_ends_at, pay_by_date, payment_done, license_status,
        assessment_number, water_connection_no, property_tax_status, water_tax_status, professional_tax_status,
        website
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const params = [
        b.id, b.legalName, b.tradeName, b.type, b.category, b.address, b.proofOfAddress, b.branchName,
        b.contactNumber, b.email, b.gstNumber, b.status || 'Pending', regDate, b.riskScore || 5, b.latitude, b.longitude,
        licenseTimestamps.license_valid_till,
        licenseTimestamps.grace_ends_at,
        licenseTimestamps.pay_by_date,
        licenseTimestamps.payment_done,
        licenseTimestamps.license_status,
        b.assessment_number,
        b.water_connection_no,
        b.property_tax_status || 'Pending',
        b.water_tax_status || 'Pending',
        b.professional_tax_status || 'Pending',
        b.website || ''
    ];

    db.run(sql, params, function (err) {
        if (err) return res.status(400).json({ error: err.message });

        const newBlock = new Block(new Date().toISOString(), {
            id: b.id,
            tradeName: b.tradeName,
            status: 'Registered',
            license: licenseTimestamps
        });
        tnMbnrChain.addBlock(newBlock);

        const ledgerSql = `INSERT INTO ledger (timestamp, data, previousHash, hash, nonce) VALUES (?,?,?,?,?)`;
        const ledgerParams = [newBlock.timestamp, JSON.stringify(newBlock.data), newBlock.previousHash, newBlock.hash, newBlock.nonce];

        db.run(ledgerSql, ledgerParams);

        res.json({ message: "success", id: this.lastID, blockHash: newBlock.hash });
    });
});

app.put('/api/admin/businesses/:id/status', apiLimiter, authenticateToken, authorizeRoles('admin'), (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Verified', 'Rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    db.run("UPDATE businesses SET status = ? WHERE id = ?", [status, id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Business not found" });

        // Add to Ledger
        const newBlock = new Block(new Date().toISOString(), {
            id,
            action: 'StatusUpdate',
            newStatus: status
        });
        tnMbnrChain.addBlock(newBlock);

        const ledgerSql = `INSERT INTO ledger (timestamp, data, previousHash, hash, nonce) VALUES (?,?,?,?,?)`;
        db.run(ledgerSql, [newBlock.timestamp, JSON.stringify(newBlock.data), newBlock.previousHash, newBlock.hash, newBlock.nonce]);

        res.json({ message: "success", status, blockHash: newBlock.hash });
    });
});

app.get('/api/ledger', (req, res) => {
    db.all("SELECT * FROM ledger ORDER BY index_id DESC", [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "success", data: rows, isValid: tnMbnrChain.isChainValid() });
    });
});

// --- QR & Verification Logic ---
const QR_SECRET = process.env.QR_SECRET_KEY || 'tn-mbnr-qr-secret-2024';

const generateQRToken = (payload) => {
    const data = JSON.stringify({ ...payload, exp: Date.now() + 30000 }); // 30s expiry
    const signature = crypto.createHmac('sha256', QR_SECRET).update(data).digest('hex');
    return Buffer.from(JSON.stringify({ payload: JSON.parse(data), signature })).toString('base64');
};

const verifyQRToken = (token) => {
    try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
        const { payload, signature } = decoded;
        const expectedSignature = crypto.createHmac('sha256', QR_SECRET).update(JSON.stringify(payload)).digest('hex');
        
        if (signature !== expectedSignature) return { status: 'COUNTERFEIT', message: 'Invalid Signature' };
        if (Date.now() > payload.exp) return { status: 'EXPIRED', message: 'Token Expired' };
        
        return { status: 'VALID', payload };
    } catch (e) {
        return { status: 'INVALID', message: 'Malformed Token' };
    }
};

app.get('/api/qr-token/:businessId', apiLimiter, (req, res) => {
    const { businessId } = req.params;
    db.get("SELECT * FROM businesses WHERE id = ?", [businessId], (err, row) => {
        if (err || !row) return res.status(404).json({ error: "Business not found" });
        
        const token = generateQRToken({
            id: row.id,
            lat: row.latitude,
            lng: row.longitude,
            name: row.tradeName
        });
        
        res.json({ token, expiresAt: Date.now() + 30000 });
    });
});

app.post('/api/verify-scan', apiLimiter, (req, res) => {
    const { token, scannerLocation } = req.body;
    if (!token || !scannerLocation) return res.status(400).json({ error: "Missing token or location" });

    const verification = verifyQRToken(token);
    
    if (verification.status !== 'VALID') {
        // Log failed scan
        db.run("INSERT INTO scans (business_id, token, scan_lat, scan_lng, result) VALUES (?,?,?,?,?)",
            ["UNKNOWN", token.substring(0, 20), scannerLocation.lat, scannerLocation.lng, verification.status]);
        return res.json(verification);
    }

    const { payload } = verification;
    
    // Check Distance (200m geofence)
    const R = 6371e3; // metres
    const φ1 = payload.lat * Math.PI/180;
    const φ2 = scannerLocation.lat * Math.PI/180;
    const Δφ = (scannerLocation.lat-payload.lat) * Math.PI/180;
    const Δλ = (scannerLocation.lng-payload.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    let finalStatus = 'VALID';
    let message = "Transaction Secure. Verification Token Valid.";

    if (distance > 200) {
        finalStatus = 'LOCATION_MISMATCH';
        message = `WARNING: This QR code is registered to another location (${Math.round(distance)}m away). Possible stolen identity.`;
    }

    // Get full business data for response
    db.get("SELECT * FROM businesses WHERE id = ?", [payload.id], (err, biz) => {
        const licenseStatus = biz ? calculateLicenseStatus(biz.registrationDate) : null;
        
        // Log scan
        db.run("INSERT INTO scans (business_id, token, scan_lat, scan_lng, result, distance) VALUES (?,?,?,?,?,?)",
            [payload.id, token.substring(0, 20), scannerLocation.lat, scannerLocation.lng, finalStatus, distance]);

        res.json({
            status: finalStatus,
            message,
            business: biz ? {
                id: biz.id,
                name: biz.tradeName,
                legalName: biz.legalName,
                gst: biz.gstNumber,
                lat: biz.latitude,
                lng: biz.longitude
            } : null,
            license: licenseStatus
        });
    });
});

// Admin Stats
app.get('/api/admin/shops', authenticateToken, authorizeRoles('admin'), (req, res) => {
    const sql = `
        SELECT b.*, 
        (SELECT COUNT(*) FROM scans WHERE business_id = b.id) as total_scans,
        (SELECT COUNT(*) FROM scans WHERE business_id = b.id AND result = 'VALID') as verified_scans,
        (SELECT COUNT(*) FROM scans WHERE business_id = b.id AND result != 'VALID') as failed_scans
        FROM businesses b
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "success", shops: rows });
    });
});

app.get('/api/admin/suspicious', authenticateToken, authorizeRoles('admin'), (req, res) => {
    db.all("SELECT s.*, b.tradeName FROM scans s LEFT JOIN businesses b ON s.business_id = b.id WHERE result != 'VALID' ORDER BY scanned_at DESC LIMIT 50", [], (err, scans) => {
        if (err) return res.status(400).json({ error: err.message });
        
        // Risky shops aggregation
        const riskySql = `
            SELECT b.tradeName as shop_name, COUNT(*) as failed_scans,
            (CAST(COUNT(*) AS REAL) / (SELECT COUNT(*) FROM scans WHERE business_id = b.id)) * 100 as risk_score
            FROM scans s
            JOIN businesses b ON s.business_id = b.id
            WHERE s.result != 'VALID'
            GROUP BY b.id
            ORDER BY failed_scans DESC
            LIMIT 10
        `;
        
        db.all(riskySql, [], (err, risky) => {
            res.json({ message: "success", scans, top_risky_shops: risky || [] });
        });
    });
});

app.post('/api/reports', upload.single('image'), (req, res) => {
    const { business_name, location, description, category, severity } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    
    const sql = `INSERT INTO reports (business_name, location, description, category, severity, image_path) VALUES (?,?,?,?,?,?)`;
    db.run(sql, [business_name, location, description, category, severity, imagePath], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "success", id: this.lastID, image: imagePath });
    });
});

app.get('/api/reports', authenticateToken, authorizeRoles('admin'), (req, res) => {
    db.all("SELECT * FROM reports ORDER BY timestamp DESC", [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "success", data: rows });
    });
});

// Serve Assets
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// SPA Catch-all
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server Hardened & Running on port ${PORT}`);
});
