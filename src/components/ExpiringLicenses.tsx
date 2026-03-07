import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Business } from '../types/types';

interface ExpiringLicensesProps {
    businesses: Business[];
}

export const ExpiringLicenses: React.FC<ExpiringLicensesProps> = ({ businesses }) => {
    const now = new Date();

    // Calculate statistics
    const expiringSoon = businesses.filter(b => {
        if (!b.license_valid_till) return false;
        const validTill = new Date(b.license_valid_till);
        const daysRemaining = (validTill.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return daysRemaining > 0 && daysRemaining <= 30;
    }).length;

    const inGrace = businesses.filter(b => {
        if (!b.license_valid_till || !b.grace_ends_at) return false;
        const validTill = new Date(b.license_valid_till);
        const graceEnds = new Date(b.grace_ends_at);
        return now > validTill && now <= graceEnds;
    }).length;

    const pendingPayment = businesses.filter(b => {
        if (!b.grace_ends_at || !b.pay_by_date) return false;
        const graceEnds = new Date(b.grace_ends_at);
        const payBy = new Date(b.pay_by_date);
        return now > graceEnds && now <= payBy && !b.payment_done;
    }).length;

    const expired = businesses.filter(b => {
        if (!b.pay_by_date) return false;
        const payBy = new Date(b.pay_by_date);
        return now > payBy && !b.payment_done;
    }).length;

    const totalNeedsAttention = expiringSoon + inGrace + pendingPayment + expired;

    // Get businesses that need attention
    const needsAttention = businesses.filter(b => {
        if (!b.license_valid_till) return false;
        const validTill = new Date(b.license_valid_till);
        const daysRemaining = (validTill.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return now > validTill || daysRemaining <= 30;
    }).sort((a, b) => {
        if (!a.license_valid_till || !b.license_valid_till) return 0;
        const aDate = new Date(a.license_valid_till);
        const bDate = new Date(b.license_valid_till);
        return aDate.getTime() - bDate.getTime();
    });

    return (
        <div className="mt-12 bg-slate-900 rounded-2xl border border-yellow-500/20 p-8 shadow-2xl">
            <div className="flex items-center mb-8">
                <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
                <h2 className="text-xl font-bold text-white">License Status Tracking</h2>
                <span className="ml-auto px-3 py-1 bg-yellow-500/10 text-yellow-500 text-sm font-bold border border-yellow-500/20 rounded-full">
                    {totalNeedsAttention} Require Attention
                </span>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/30">
                    <p className="text-xs text-green-400 uppercase font-bold tracking-wider mb-2">Expiring Soon (≤30 days)</p>
                    <p className="text-3xl font-bold text-green-400">{expiringSoon}</p>
                </div>

                <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/30">
                    <p className="text-xs text-yellow-400 uppercase font-bold tracking-wider mb-2">Grace Period</p>
                    <p className="text-3xl font-bold text-yellow-400">{inGrace}</p>
                </div>

                <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/30">
                    <p className="text-xs text-orange-400 uppercase font-bold tracking-wider mb-2">Pending Payment</p>
                    <p className="text-3xl font-bold text-orange-400">{pendingPayment}</p>
                </div>

                <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/30">
                    <p className="text-xs text-red-400 uppercase font-bold tracking-wider mb-2">Expired</p>
                    <p className="text-3xl font-bold text-red-400">{expired}</p>
                </div>
            </div>

            {/* Detailed List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {needsAttention.length === 0 ? (
                    <p className="text-slate-500 text-center py-8 bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
                        All licenses are active and valid ✅
                    </p>
                ) : (
                    needsAttention.map(b => {
                        // TypeScript: license_valid_till is guaranteed to exist because we filtered for it
                        const validTill = new Date(b.license_valid_till!);
                        const graceEnds = b.grace_ends_at ? new Date(b.grace_ends_at) : validTill;
                        const payBy = b.pay_by_date ? new Date(b.pay_by_date) : validTill;
                        const daysToExpiry = Math.ceil((validTill.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                        let status, color, message;
                        if (now <= validTill) {
                            status = 'EXPIRING SOON';
                            color = 'green';
                            message = `${daysToExpiry} days remaining`;
                        } else if (now <= graceEnds) {
                            status = 'GRACE PERIOD';
                            color = 'yellow';
                            message = `${Math.ceil((graceEnds.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days in grace`;
                        } else if (now <= payBy && !b.payment_done) {
                            status = 'PENDING PAYMENT';
                            color = 'orange';
                            message = `Payment due by ${payBy.toLocaleDateString()}`;
                        } else {
                            status = 'EXPIRED';
                            color = 'red';
                            message = `Expired ${Math.ceil((now.getTime() - payBy.getTime()) / (1000 * 60 * 60 * 24))} days ago`;
                        }

                        return (
                            <div key={b.id} className={`bg-slate-950/50 p-4 rounded-xl border ${color === 'green' ? 'border-green-500/20' :
                                color === 'yellow' ? 'border-yellow-500/20' :
                                    color === 'orange' ? 'border-orange-500/20' :
                                        'border-red-500/20'
                                } hover:border-opacity-50 transition-all`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-white font-bold">{b.tradeName}</h4>
                                        <p className="text-xs text-slate-400 mt-1">
                                            <span className={`font-bold ${color === 'green' ? 'text-green-400' :
                                                color === 'yellow' ? 'text-yellow-400' :
                                                    color === 'orange' ? 'text-orange-400' :
                                                        'text-red-400'
                                                }`}>
                                                {status}
                                            </span>
                                            {' • '}{message}
                                        </p>
                                        <p className="text-[10px] text-slate-600 mt-1">
                                            Valid till: {validTill.toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button className={`px-3 py-1 ${color === 'green' ? 'bg-green-600/10 border-green-600/20 text-green-500 hover:bg-green-600' :
                                        color === 'yellow' ? 'bg-yellow-600/10 border-yellow-600/20 text-yellow-500 hover:bg-yellow-600' :
                                            color === 'orange' ? 'bg-orange-600/10 border-orange-600/20 text-orange-500 hover:bg-orange-600' :
                                                'bg-red-600/10 border-red-600/20 text-red-500 hover:bg-red-600'
                                        } border hover:text-white font-bold text-xs rounded-lg transition-all`}>
                                        RENEW
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
