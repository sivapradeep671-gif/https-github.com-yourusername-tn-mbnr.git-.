/**
 * Advanced Role-Based Access Control (RBAC)
 * Fulfills the Security Hardening requirement for scope-based permissions.
 */

export type Role = 'CITIZEN' | 'INSPECTOR' | 'MUNICIPAL_COMMISSIONER' | 'STATE_ADMIN';

export interface UserSession {
    id: string;
    role: Role;
    assignedWards?: string[]; // E.g., ['WARD_12', 'WARD_13']
    clearanceLevel: number;
}

export interface ResourceScope {
    ward: string;
    isConfidential: boolean;
}

/**
 * Validates if the current user has permission to view or mutate a specific resource
 * based on their role and assigned municipal wards.
 */
export function hasAccess(user: UserSession, resource: ResourceScope): boolean {
    if (!user) return false;

    // State Admins have global override access
    if (user.role === 'STATE_ADMIN') {
        return true;
    }

    // Municipal Commissioners have access to all wards but cannot view top-secret state data
    if (user.role === 'MUNICIPAL_COMMISSIONER') {
        return !resource.isConfidential;
    }

    // Inspectors (Field Officers) can strictly only access data within their assigned wards
    if (user.role === 'INSPECTOR') {
        if (!user.assignedWards || user.assignedWards.length === 0) return false;
        return user.assignedWards.includes(resource.ward) && !resource.isConfidential;
    }

    // Citizens can only view public non-confidential data for their specific area (if applicable)
    if (user.role === 'CITIZEN') {
        return !resource.isConfidential;
    }

    return false;
}

/**
 * Filter an array of business records down to only what the officer is allowed to see.
 */
export function enforceWardScope<T extends { ward: string }>(user: UserSession, records: T[]): T[] {
    if (user.role === 'STATE_ADMIN' || user.role === 'MUNICIPAL_COMMISSIONER') {
        return records;
    }
    
    if (user.role === 'INSPECTOR' && user.assignedWards) {
        return records.filter(record => user.assignedWards!.includes(record.ward));
    }
    
    return [];
}
