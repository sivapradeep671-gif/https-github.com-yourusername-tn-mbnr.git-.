const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database.cjs');
const { Blockchain, Block } = require('./blockchain.cjs');
require('dotenv').config({ path: '../.env' });

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
        // Rebuild chain in memory (simplified)
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

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Get all businesses
app.get('/api/businesses', (req, res) => {
    const sql = "SELECT * FROM businesses";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// Register a new business
app.post('/api/businesses', (req, res) => {
    const { id, legalName, tradeName, type, category, address, proofOfAddress, branchName, contactNumber, email, gstNumber, status, registrationDate, riskScore } = req.body;
    const sql = `INSERT INTO businesses (id, legalName, tradeName, type, category, address, proofOfAddress, branchName, contactNumber, email, gstNumber, status, registrationDate, riskScore) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const params = [id, legalName, tradeName, type, category, address, proofOfAddress, branchName, contactNumber, email, gstNumber, status, registrationDate, riskScore];

    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }

        // Add to Blockchain
        const newBlock = new Block(new Date().toISOString(), { id, tradeName, status: 'Registered' });
        tnMbnrChain.addBlock(newBlock);

        // Save Block to DB
        const ledgerSql = `INSERT INTO ledger (timestamp, data, previousHash, hash, nonce) VALUES (?,?,?,?,?)`;
        const ledgerParams = [newBlock.timestamp, JSON.stringify(newBlock.data), newBlock.previousHash, newBlock.hash, newBlock.nonce];

        db.run(ledgerSql, ledgerParams, (err) => {
            if (err) console.error("Error saving block to ledger:", err);
        });

        res.json({
            "message": "success",
            "data": req.body,
            "id": this.lastID,
            "blockHash": newBlock.hash
        });
    });
});

// AI Verification Endpoint
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || "");

app.post('/api/verify-business', async (req, res) => {
    try {
        const { businessName, type } = req.body;

        if (!process.env.VITE_GEMINI_API_KEY) {
            // Mock response if no key
            return res.json({
                verified: true,
                confidence: 0.85,
                analysis: "Mock Analysis: The business name appears valid and appropriate for the specified sector. (API Key missing)"
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Analyze if the business name "${businessName}" is appropriate and valid for a "${type}" business in Tamil Nadu. Return a JSON response with fields: verified (boolean), confidence (0-1), and analysis (string).`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // cleanup json string
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(jsonStr);

        res.json(analysis);
    } catch (error) {
        console.error("AI Verification Error:", error);
        res.status(500).json({ error: "Failed to verify business" });
    }
});

// Get Blockchain Ledger
app.get('/api/ledger', (req, res) => {
    const sql = "SELECT * FROM ledger ORDER BY index_id DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows,
            "isValid": tnMbnrChain.isChainValid()
        });
    });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Network access enabled.`);
});
