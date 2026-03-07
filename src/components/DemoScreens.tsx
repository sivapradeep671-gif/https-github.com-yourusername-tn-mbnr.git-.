import React from 'react';
import { CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export const DemoScreens: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto py-12 px-4">
            {/* Success Screen */}
            <div className="bg-slate-900 rounded-3xl border border-green-500/30 p-8 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-400 mb-2">VERIFIED BUSINESS</h3>
                    <p className="text-green-500/70 font-mono text-sm mb-6">+50 XP REWARDED</p>

                    <div className="w-full bg-slate-950 rounded-xl p-6 border border-slate-800 text-left">
                        <div className="mb-3">
                            <label className="text-[10px] text-slate-500 uppercase tracking-widest">Business Name</label>
                            <p className="text-white font-bold">Madurai Spices Pvt Ltd</p>
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-500 uppercase tracking-widest">Status</label>
                            <p className="text-green-400 flex items-center font-bold">
                                <ShieldCheck className="h-4 w-4 mr-1" /> Licensed & Authentic
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 text-center text-xs text-slate-500 uppercase tracking-widest">Example Verification Result</div>
            </div>

            {/* Failure Screen */}
            <div className="bg-slate-900 rounded-3xl border border-red-500/30 p-8 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                        <AlertTriangle className="h-12 w-12 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-500 mb-2">COUNTERFEIT</h3>
                    <p className="text-red-500/70 font-mono text-sm mb-6">UNAUTHORIZED SCAN</p>

                    <div className="w-full bg-slate-950 rounded-xl p-6 border border-slate-800 text-left">
                        <div className="mb-3">
                            <label className="text-[10px] text-slate-500 uppercase tracking-widest">Reason</label>
                            <p className="text-white font-bold">Location Mismatch (GPS Error)</p>
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-500 uppercase tracking-widest">Risk Level</label>
                            <p className="text-red-500 flex items-center font-bold">
                                CRITICAL - TAMPER DETECTED
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 text-center text-xs text-slate-500 uppercase tracking-widest">Example Scam Detection</div>
            </div>
        </div>
    );
};
