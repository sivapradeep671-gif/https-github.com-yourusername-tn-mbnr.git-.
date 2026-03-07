import React from 'react';
import { Building2, Droplets, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';
import type { Business } from '../types/types';

interface TaxComplianceWidgetProps {
    business: Business;
}

export const TaxComplianceWidget: React.FC<TaxComplianceWidgetProps> = ({ business }) => {
    const taxes = [
        {
            name: 'Property Tax',
            id: business.assessment_number || 'N/A',
            status: business.property_tax_status || 'Pending',
            icon: Building2,
            amount: '₹12,400',
            dueDate: '31 Mar 2024'
        },
        {
            name: 'Water Tax',
            id: business.water_connection_no || 'N/A',
            status: business.water_tax_status || 'Pending',
            icon: Droplets,
            amount: '₹4,200',
            dueDate: '15 Apr 2024'
        },
        {
            name: 'Professional Tax',
            id: 'PT-2024-001', // Example fixed ID for demo if not in DB
            status: business.professional_tax_status || 'Pending',
            icon: Briefcase,
            amount: '₹2,500',
            dueDate: '30 Sep 2024'
        }
    ];

    const allPaid = taxes.every(t => t.status === 'Paid');

    return (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
            <div className="flex items-center justification-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Building2 className="h-6 w-6 text-blue-500" />
                        Municipal Tax Compliance
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">One-Stop Payment Portal</p>
                </div>
                {allPaid && (
                    <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" /> ALL CLEAR
                    </span>
                )}
            </div>

            <div className="space-y-4">
                {taxes.map((tax, idx) => (
                    <div key={idx} className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between group hover:border-slate-700 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${tax.status === 'Paid' ? 'bg-green-500/10 text-green-500' : 'bg-slate-800 text-slate-400'}`}>
                                <tax.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">{tax.name}</h4>
                                <p className="text-xs text-slate-500 font-mono">ID: {tax.id}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            {tax.status === 'Paid' ? (
                                <div className="flex flex-col items-end">
                                    <span className="text-green-500 font-bold text-sm flex items-center">
                                        <CheckCircle className="h-4 w-4 mr-1" /> Paid
                                    </span>
                                    <span className="text-[10px] text-slate-600">on {new Date().toLocaleDateString()}</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-white font-bold">{tax.amount}</span>
                                    <span className="text-[10px] text-red-400 flex items-center">
                                        Due: {tax.dueDate}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {!allPaid && (
                <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-blue-900/20">
                    Pay All Municipal Taxes
                    <ArrowRight className="h-4 w-4 ml-2" />
                </button>
            )}
        </div>
    );
};
