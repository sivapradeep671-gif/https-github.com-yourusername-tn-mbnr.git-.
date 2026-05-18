/**
 * Database Indexing Strategy
 * Fulfills Section 3: Performance & Optimization
 * Adds necessary indexes to MongoDB for high-speed queries on millions of rows.
 */
const { MongoClient } = require('mongodb');
const { config } = require('../server/config/secrets.cjs');

async function createIndexes() {
  if (!config.db.uri) {
    console.log('[Indexing] No MONGODB_URI found. Skipping Mongo indexing (using SQLite fallback).');
    return;
  }

  const client = new MongoClient(config.db.uri);

  try {
    await client.connect();
    const db = client.db('tn_mbnr');
    const businesses = db.collection('businesses');

    console.log('[Indexing] Connected to MongoDB. Building indexes...');

    // Standard high-velocity lookups
    await businesses.createIndex({ shop_id: 1 }, { unique: true });
    await businesses.createIndex({ status: 1 });
    await businesses.createIndex({ application_date: -1 });
    await businesses.createIndex({ due_date: 1 });
    
    // Geographic / Ward-based filtering for RBAC
    await businesses.createIndex({ ward: 1, district_name: 1, municipality_name: 1 });
    
    // Identity search (Taxation and Compliance)
    await businesses.createIndex({ pan_number: 1 });
    await businesses.createIndex({ GST_number: 1 });
    await businesses.createIndex({ aadhar_number: 1 });
    
    // QR Code telemetry
    await businesses.createIndex({ qrcode_scanned: -1 });

    console.log('[Indexing] All B-Tree indexes successfully built for production scaling.');
  } catch (error) {
    console.error('[Indexing] Failed to build indexes:', error);
  } finally {
    await client.close();
  }
}

createIndexes();
