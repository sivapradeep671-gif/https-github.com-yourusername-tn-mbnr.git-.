/**
 * License Status Calculator
 * Calculates dynamic license status based on timestamps
 */

function calculateLicenseStatus(business) {
    if (!business) {
        return {
            status: 'INVALID',
            color: 'red',
            message: 'Business not found',
            canTransact: false
        };
    }

    // Check if manually blocked
    if (business.license_status === 'BLOCKED') {
        return {
            status: 'BLOCKED',
            color: 'red',
            message: 'License blocked by authorities ❌',
            canTransact: false,
            details: 'This business has been blocked by municipal authorities'
        };
    }

    // If no license dates set, assume active (for backwards compatibility)
    if (!business.license_valid_till) {
        return {
            status: 'ACTIVE',
            color: 'green',
            message: 'Active license ✅',
            canTransact: true,
            details: 'Legacy business - no expiry date set'
        };
    }

    const now = new Date();
    const validTill = new Date(business.license_valid_till);
    const graceEnds = new Date(business.grace_ends_at);
    const payBy = new Date(business.pay_by_date);

    // Calculate days remaining/overdue
    const daysToExpiry = Math.ceil((validTill - now) / (1000 * 60 * 60 * 24));
    const daysInGrace = Math.ceil((graceEnds - now) / (1000 * 60 * 60 * 24));
    const daysOverdue = Math.ceil((now - payBy) / (1000 * 60 * 60 * 24));

    // 1. ACTIVE: Within valid period
    if (now <= validTill) {
        const urgency = daysToExpiry <= 30 ? ' (Renewal due soon)' : '';
        return {
            status: 'ACTIVE',
            color: 'green',
            message: `Active license ✅${urgency}`,
            canTransact: true,
            daysRemaining: daysToExpiry,
            validTill: validTill.toISOString(),
            details: `License valid for ${daysToExpiry} more days`
        };
    }

    // 2. GRACE: Grace period (30 days after expiry)
    if (validTill < now && now <= graceEnds) {
        return {
            status: 'GRACE',
            color: 'yellow',
            message: 'Auto-approval – Pay within 1 month ⚠️',
            canTransact: true,
            daysRemaining: daysInGrace,
            graceEnds: graceEnds.toISOString(),
            payBy: payBy.toISOString(),
            details: `Grace period active. Payment due by ${payBy.toLocaleDateString()}`
        };
    }

    // 3. PENDING: Payment pending (within payment window)
    if (graceEnds < now && now <= payBy && !business.payment_done) {
        return {
            status: 'PENDING',
            color: 'orange',
            message: 'Pending payment – Risk warning ⚠️',
            canTransact: true, // Still can transact but with warning
            daysOverdue: Math.ceil((now - graceEnds) / (1000 * 60 * 60 * 24)),
            payBy: payBy.toISOString(),
            details: `Payment overdue. Must pay by ${payBy.toLocaleDateString()}`
        };
    }

    // 4. EXPIRED: Payment deadline passed
    if (now > payBy && !business.payment_done) {
        return {
            status: 'EXPIRED',
            color: 'red',
            message: 'Expired / Not valid ❌',
            canTransact: false,
            daysOverdue: daysOverdue,
            details: `License expired ${daysOverdue} days ago. Renewal required.`
        };
    }

    // 5. If payment done during grace/pending, return to ACTIVE
    if (business.payment_done && now > validTill) {
        return {
            status: 'RENEWED',
            color: 'green',
            message: 'License renewed ✅',
            canTransact: true,
            details: 'Payment received. License renewal in process.'
        };
    }

    // Fallback
    return {
        status: 'UNKNOWN',
        color: 'gray',
        message: 'Status unknown',
        canTransact: false,
        details: 'Unable to determine license status'
    };
}

/**
 * Calculate license timestamps for new business
 */
function calculateLicenseTimestamps(registrationDate) {
    const regDate = new Date(registrationDate);

    // License valid for 1 year
    const validTill = new Date(regDate);
    validTill.setFullYear(validTill.getFullYear() + 1);

    // Grace period: 30 days after expiry
    const graceEnds = new Date(validTill);
    graceEnds.setDate(graceEnds.getDate() + 30);

    // Payment deadline: 1 month after expiry
    const payBy = new Date(validTill);
    payBy.setMonth(payBy.getMonth() + 1);

    return {
        license_valid_till: validTill.toISOString(),
        grace_ends_at: graceEnds.toISOString(),
        pay_by_date: payBy.toISOString(),
        payment_done: 0,
        license_status: 'ACTIVE'
    };
}

module.exports = {
    calculateLicenseStatus,
    calculateLicenseTimestamps
};
