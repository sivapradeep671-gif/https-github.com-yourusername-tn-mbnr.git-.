export interface Business {
    id: string;
    legalName: string;
    tradeName: string;
    type: 'Sole Proprietorship' | 'Partnership' | 'Private Limited' | 'Public Limited' | 'LLP';
    address: string;
    branchName?: string; // For multiple branches
    contactNumber: string;
    email: string;
    website?: string;
    gstNumber?: string;
    category: string;
    proofOfAddress?: string; // URL or file path
    logoUrl?: string;
    status: 'Pending' | 'Verified' | 'Rejected';
    riskScore?: number; // 0-100
    registrationDate: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    latitude?: number;
    longitude?: number;
    // License Status Fields
    license_valid_till?: string; // ISO date string
    grace_ends_at?: string; // ISO date string
    pay_by_date?: string; // ISO date string
    payment_done?: number; // 0 or 1 (SQLite boolean)
    license_status?: 'ACTIVE' | 'GRACE' | 'PENDING' | 'EXPIRED' | 'BLOCKED';
    // Municipality Tax Fields
    assessment_number?: string;
    water_connection_no?: string;
    property_tax_status?: 'Paid' | 'Pending' | 'N/A';
    water_tax_status?: 'Paid' | 'Pending' | 'N/A';
    professional_tax_status?: 'Paid' | 'Pending' | 'N/A';
}

export interface AnalysisResult {
    isSafe: boolean;
    riskLevel: 'Low' | 'Medium' | 'High';
    similarBrands?: string[];
    message: string;
}

export interface CitizenReport {
    id: string;
    businessName: string;
    location: string;
    description: string;
    category?: string;
    severity?: string;
    imageUrl?: string;
    status: 'Submitted' | 'Under Review' | 'Resolved';
    timestamp: string;
}
