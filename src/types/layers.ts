export type LayerId =
    | 'layer_1_municipal'
    | 'layer_2_ecommerce'
    | 'layer_3_food'
    | 'layer_4_education'
    | 'layer_5_finance'
    | 'layer_6_real_estate'
    | 'layer_7_healthcare'
    | 'layer_8_legal'
    | 'layer_9_transport'
    | 'layer_10_travel'
    | 'layer_11_employment'
    | 'layer_12_agriculture'
    | 'layer_13_welfare'
    | 'layer_14_media'
    | 'layer_15_startup';

export interface LayerConfig {
    id: LayerId;
    name: string;
    regulator: string;
    description: string;
    requiredFields: string[];
}

export const LAYERS: Record<LayerId, LayerConfig> = {
    'layer_1_municipal': {
        id: 'layer_1_municipal',
        name: 'Municipal Trade',
        regulator: 'ULB License',
        description: 'Shops, Establishments, and Trade Licenses',
        requiredFields: ['activity_code', 'shop_area_sqft', 'waste_mgmt_plan']
    },
    'layer_2_ecommerce': {
        id: 'layer_2_ecommerce',
        name: 'E-commerce',
        regulator: 'GSTIN',
        description: 'Online Sellers and Marketplaces',
        requiredFields: ['marketplace_urls', 'return_policy_url']
    },
    'layer_3_food': {
        id: 'layer_3_food',
        name: 'Food Safety',
        regulator: 'FSSAI',
        description: 'Restaurants, Food Handlers, Manufacturing',
        requiredFields: ['license_no', 'hygiene_rating', 'kitchen_audit_date']
    },
    'layer_4_education': {
        id: 'layer_4_education',
        name: 'Education',
        regulator: 'UGC/AICTE',
        description: 'Colleges, Universities, Training Centers',
        requiredFields: ['accreditation_grade', 'student_count', 'faculty_ratio']
    },
    'layer_5_finance': {
        id: 'layer_5_finance',
        name: 'Finance',
        regulator: 'RBI',
        description: 'NBFCs, Banks, Lending Apps',
        requiredFields: ['nbfc_category', 'capital_adequacy', 'branch_network']
    },
    'layer_6_real_estate': {
        id: 'layer_6_real_estate',
        name: 'Real Estate',
        regulator: 'RERA',
        description: 'Developers, Projects, Agents',
        requiredFields: ['project_completion_rate', 'escrow_status']
    },
    'layer_7_healthcare': {
        id: 'layer_7_healthcare',
        name: 'Healthcare',
        regulator: 'NMC',
        description: 'Hospitals, Clinics, Doctors',
        requiredFields: ['bed_count', 'specialties', 'disposal_cert']
    },
    'layer_8_legal': {
        id: 'layer_8_legal',
        name: 'Legal Services',
        regulator: 'Bar Council',
        description: 'Lawyers, Notaries, Firms',
        requiredFields: ['enrollment_year', 'practice_area', 'bar_association']
    },
    'layer_9_transport': {
        id: 'layer_9_transport',
        name: 'Transport',
        regulator: 'RTO',
        description: 'Logistics, Fleet Operators',
        requiredFields: ['vehicle_fleet_size', 'permit_type']
    },
    'layer_10_travel': {
        id: 'layer_10_travel',
        name: 'Travel & Tourism',
        regulator: 'Tourism Dept',
        description: 'Tour Operators, Guides, Agencies',
        requiredFields: ['iata_code', 'tour_operator_category']
    },
    'layer_11_employment': {
        id: 'layer_11_employment',
        name: 'Employment',
        regulator: 'EPFO/ESIC',
        description: 'Recruiters, Employers, Manpower Agencies',
        requiredFields: ['employee_count', 'min_wage_audit']
    },
    'layer_12_agriculture': {
        id: 'layer_12_agriculture',
        name: 'Agriculture',
        regulator: 'Agri Dept',
        description: 'Fertilizer Dealers, Seeds, warehouses',
        requiredFields: ['fertilizer_license', 'storage_capacity']
    },
    'layer_13_welfare': {
        id: 'layer_13_welfare',
        name: 'Welfare',
        regulator: 'Social Welfare',
        description: 'NGOs, Scheme Beneficiaries',
        requiredFields: ['scheme_enrollments', 'audit_report']
    },
    'layer_14_media': {
        id: 'layer_14_media',
        name: 'Media',
        regulator: 'I&B Ministry',
        description: 'Digital Media, Publishers, Production',
        requiredFields: ['press_id', 'content_category']
    },
    'layer_15_startup': {
        id: 'layer_15_startup',
        name: 'Startup',
        regulator: 'DPIIT',
        description: 'Innovators, Incubators',
        requiredFields: ['dipp_number', 'sector_focus']
    }
};
