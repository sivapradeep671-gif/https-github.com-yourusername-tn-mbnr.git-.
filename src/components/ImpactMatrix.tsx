import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const ImpactMatrix: React.FC = () => {
    const { t } = useLanguage();
    const data = t.impact.rows;

    return (
        <div className="bg-slate-900 py-20 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t.impact.title}</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        {t.impact.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((item, index) => (
                        <div key={index} className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800/50 group">
                            <div className="flex items-center mb-4">
                                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-3 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                                <h3 className="text-sm font-bold text-yellow-500 uppercase tracking-widest">{item.dim}</h3>
                            </div>
                            <p className="text-slate-300 leading-relaxed group-hover:text-white transition-colors capitalize">
                                {item.adv}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Assumption Disclaimer */}
            <p className="mt-4 text-center text-xs text-slate-500 italic">
                {t.impact.note}
            </p>
        </div>
    );
};
