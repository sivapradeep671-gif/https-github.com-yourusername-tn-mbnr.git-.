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

                <div className="overflow-hidden rounded-xl border border-slate-800 shadow-2xl">
                    <table className="min-w-full divide-y divide-slate-800">
                        <thead className="bg-slate-950">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-yellow-500 uppercase tracking-wider">
                                    {t.impact.columns.dimension}
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    {t.impact.columns.advantage}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-slate-900 divide-y divide-slate-800">
                            {data.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                        {item.dim}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">
                                        {item.adv}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
