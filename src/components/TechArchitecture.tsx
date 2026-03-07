import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Database, Server, Smartphone, ShieldCheck, Cpu } from 'lucide-react';

export const TechArchitecture: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="bg-slate-950 py-20 border-t border-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {t.tech_stack.title}
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        {t.tech_stack.subtitle}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    {/* Tech Stack List - UPDATED FOR GOV PROPOSAL */}
                    <div className="w-full lg:w-1/2 space-y-6">
                        <div className="flex items-start space-x-4 bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-colors">
                            <Smartphone className="h-8 w-8 text-blue-400 mt-1" />
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Citizen Interface</h3>
                                <p className="text-slate-400">{t.tech_stack.frontend}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-green-500/50 transition-colors">
                            <Server className="h-8 w-8 text-green-400 mt-1" />
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">API & Integration</h3>
                                <p className="text-slate-400">{t.tech_stack.backend}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-yellow-500/50 transition-colors">
                            <Database className="h-8 w-8 text-yellow-400 mt-1" />
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Secure Data Storage</h3>
                                <p className="text-slate-400">{t.tech_stack.db}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-purple-500/50 transition-colors">
                            <Cpu className="h-8 w-8 text-purple-400 mt-1" />
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">AI Fraud Engine</h3>
                                <p className="text-slate-400">{t.tech_stack.ai}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-orange-500/50 transition-colors">
                            <ShieldCheck className="h-8 w-8 text-orange-400 mt-1" />
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Immutable Ledger</h3>
                                <p className="text-slate-400">{t.tech_stack.blockchain}</p>
                            </div>
                        </div>
                    </div>

                    {/* Architecture Visual Placeholder */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative bg-slate-900 rounded-xl border border-slate-800 p-8 flex items-center justify-center min-h-[500px]">
                            {/* Detailed CSS Flow Chart */}
                            <div className="absolute inset-0 bg-grid-slate-800/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>

                            <div className="relative z-10 flex flex-col items-center w-full max-w-md">
                                {/* Top Layer: Clients */}
                                <div className="flex space-x-4 w-full justify-center mb-8">
                                    <div className="bg-slate-800 border border-blue-500/50 p-3 rounded-lg text-blue-100 font-mono text-xs w-1/3 text-center">
                                        Mobile App (PWA)
                                    </div>
                                    <div className="bg-slate-800 border border-blue-500/50 p-3 rounded-lg text-blue-100 font-mono text-xs w-1/3 text-center">
                                        Admin Portal
                                    </div>
                                </div>

                                {/* Vertical Line */}
                                <div className="h-8 w-0.5 bg-slate-700 mb-2"></div>
                                <div className="h-0.5 w-full max-w-[200px] bg-slate-700 mb-2"></div>
                                <div className="h-4 w-0.5 bg-slate-700 mb-4"></div>


                                {/* Middle Layer: API Gateway */}
                                <div className="bg-slate-800 border-2 border-green-500 p-4 rounded-lg text-green-100 font-mono w-full text-center shadow-lg shadow-green-500/20 mb-8 relative">
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-slate-950 px-2 text-xs text-green-400">
                                        API Gateway / Load Balancer
                                    </div>
                                    Secure REST / GraphQL API
                                </div>

                                {/* Bottom Layer: Services Grid */}
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="bg-slate-800 border border-purple-500/50 p-3 rounded-lg text-purple-100 font-mono text-xs text-center">
                                        <div className="text-purple-400 text-[10px] mb-1">AI ENGINE</div>
                                        Fraud Detection
                                    </div>
                                    <div className="bg-slate-800 border border-yellow-500/50 p-3 rounded-lg text-yellow-100 font-mono text-xs text-center">
                                        <div className="text-yellow-400 text-[10px] mb-1">DATA STORE</div>
                                        PostgreSQL (Encrypted)
                                    </div>
                                    <div className="bg-slate-800 border border-orange-500/50 p-3 rounded-lg text-orange-100 font-mono text-xs text-center col-span-2">
                                        <div className="text-orange-400 text-[10px] mb-1">AUDIT TRAIL</div>
                                        Permissioned Blockchain Ledger
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-slate-500 text-sm">
                                Architecture compliant with TNeGA & MeitY Standards
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
