import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Lightbulb, Target, TrendingUp, Map } from 'lucide-react';

export const HackathonJury: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="bg-slate-900 py-16 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className=" bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-8 md:p-12 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20"></div>

                    <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4 inline-block">
                        {t.hackathon.title}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <Target className="h-6 w-6 text-red-400" />
                                    <h3 className="text-lg font-semibold text-white">Problem Statement</h3>
                                </div>
                                <p className="text-slate-300 leading-relaxed pl-9">
                                    {t.hackathon.problem}
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <Lightbulb className="h-6 w-6 text-yellow-400" />
                                    <h3 className="text-lg font-semibold text-white">Our Solution</h3>
                                </div>
                                <p className="text-slate-300 leading-relaxed pl-9">
                                    {t.hackathon.solution}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <TrendingUp className="h-6 w-6 text-green-400" />
                                    <h3 className="text-lg font-semibold text-white">{t.hackathon.impact_title}</h3>
                                </div>
                                <ul className="space-y-2 pl-9">
                                    {t.hackathon.impact_points.map((point: string, idx: number) => (
                                        <li key={idx} className="text-slate-300 list-disc marker:text-green-500">
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <Map className="h-6 w-6 text-blue-400" />
                                    <h3 className="text-lg font-semibold text-white">Future Roadmap</h3>
                                </div>
                                <p className="text-slate-300 leading-relaxed pl-9">
                                    {t.hackathon.roadmap}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
