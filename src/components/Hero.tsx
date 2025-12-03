import React from 'react';
import { Shield, Zap, Users, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Hero: React.FC<{ onRegister: () => void }> = ({ onRegister }) => {
    const { t } = useLanguage();

    return (
        <div className="bg-slate-950 text-white min-h-[calc(100vh-4rem)] flex flex-col justify-center relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-900 border border-slate-800 mb-8 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        <span className="text-slate-400 text-sm font-medium">{t.hero.badge}</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-white via-slate-200 to-slate-400 text-transparent bg-clip-text">
                        {t.hero.title_prefix}<br />
                        <span className="text-yellow-500">{t.hero.title_suffix}</span>
                    </h1>

                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        {t.hero.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <button
                            onClick={onRegister}
                            className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20 flex items-center"
                        >
                            <Shield className="mr-2 h-5 w-5" />
                            {t.hero.cta_register}
                        </button>
                        <button className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl border border-slate-800 transition-all flex items-center">
                            <Activity className="mr-2 h-5 w-5" />
                            {t.hero.cta_dashboard}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-yellow-500/50 transition-colors">
                            <Zap className="h-8 w-8 text-yellow-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">{t.hero.features.ai.title}</h3>
                            <p className="text-slate-400">{t.hero.features.ai.desc}</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
                            <Shield className="h-8 w-8 text-blue-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">{t.hero.features.blockchain.title}</h3>
                            <p className="text-slate-400">{t.hero.features.blockchain.desc}</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-green-500/50 transition-colors">
                            <Users className="h-8 w-8 text-green-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">{t.hero.features.community.title}</h3>
                            <p className="text-slate-400">{t.hero.features.community.desc}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
