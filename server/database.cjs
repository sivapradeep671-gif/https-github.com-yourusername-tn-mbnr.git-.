const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'tn_mbnr.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS businesses (
            id TEXT PRIMARY KEY,
            legalName TEXT,
            tradeName TEXT,
            type TEXT,
            category TEXT,
            address TEXT,
            proofOfAddress TEXT,
            branchName TEXT,
            contactNumber TEXT,
            email TEXT,
            gstNumber TEXT,
            status TEXT,
            registrationDate TEXT,
            riskScore INTEGER
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err.message);
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS ledger (
            index_id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            data TEXT,
            previousHash TEXT,
            hash TEXT,
            nonce INTEGER
        )`, (err) => {
            if (err) {
                console.error('Error creating ledger table', err.message);
            }
        });
    }
});

module.exports = db;
