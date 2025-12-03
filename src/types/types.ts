export interface Business {
    id: string;
    legalName: string;
    tradeName: string;
    type: 'Sole Proprietorship' | 'Partnership' | 'Private Limited' | 'Public Limited' | 'LLP';
    address: string;
    branchName?: string; // For multiple branches
    contactNumber: string;
    email: string;
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
    imageUrl?: string;
    status: 'Submitted' | 'Under Review' | 'Resolved';
    timestamp: string;
}
