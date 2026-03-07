-- TrustReg TN: 15-Layer Unified Trust Infrastructure
-- PostgreSQL Schema DDL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Base Entities Table (The Core Registry)
CREATE TABLE base_entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- The Layer Identifier (Taxonomy)
    -- e.g., 'layer_1_municipal', 'layer_3_food'
    entity_type VARCHAR(50) NOT NULL, 
    
    -- Core Identity
    legal_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Identity Proof (Hashed for privacy)
    owner_aadhaar_hash VARCHAR(64) NOT NULL,
    
    -- Sector Specific Data (Flexible JSONB)
    -- Contains layer-specific fields like:
    -- FSSAI: { "license_no": "...", "hygiene_rating": "A" }
    -- Education: { "ugc_code": "...", "naac_grade": "A++" }
    sector_specific_data JSONB DEFAULT '{}'::jsonb,
    
    -- Location (GeoJSON compatible)
    location JSONB, -- { "lat": 13.08, "lng": 80.27, "address": "..." }
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_blacklisted BOOLEAN DEFAULT FALSE,
    blacklist_reason TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for scale
CREATE INDEX idx_base_entities_type ON base_entities(entity_type);
CREATE INDEX idx_base_entities_aadhaar ON base_entities(owner_aadhaar_hash);
CREATE INDEX idx_base_entities_data ON base_entities USING gin (sector_specific_data);

-- 2. Unified Trust Ledger (Dynamic Trust Score)
CREATE TABLE unified_trust_ledger (
    entity_id UUID PRIMARY KEY REFERENCES base_entities(id) ON DELETE CASCADE,
    
    -- Calculated Metrics
    current_trust_score DECIMAL(5,2) DEFAULT 50.00, -- 0.00 to 100.00
    
    -- Aggregates
    total_complaints INT DEFAULT 0,
    resolved_complaints INT DEFAULT 0,
    total_inspections INT DEFAULT 0,
    avg_inspection_rating DECIMAL(3,2),
    
    -- Trend Analysis
    trust_trend VARCHAR(20) DEFAULT 'STABLE', -- 'IMPROVING', 'DECLINING', 'STABLE'
    last_verification_date TIMESTAMP WITH TIME ZONE,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trust_ledger_score ON unified_trust_ledger(current_trust_score);

-- 3. Complaints & Events
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES base_entities(id),
    
    -- Complaint Details
    complaint_type VARCHAR(50) NOT NULL, 
    description TEXT,
    evidence_urls TEXT[], 
    
    -- Impact Calculation
    severity VARCHAR(20) NOT NULL, -- 'MINOR', 'MAJOR', 'CRITICAL'
    impact_on_trust DECIMAL(5,2) DEFAULT 0.0, -- Points deducted from Trust Score
    
    -- Status
    status VARCHAR(20) DEFAULT 'OPEN', -- 'OPEN', 'RESOLVED', 'DISMISSED'
    resolution_notes TEXT,
    
    -- Metadata
    reporter_hash VARCHAR(64), -- Anonymous reporter ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_complaints_entity ON complaints(entity_id);
