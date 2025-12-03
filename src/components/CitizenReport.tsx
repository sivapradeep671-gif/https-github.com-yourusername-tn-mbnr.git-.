import React from 'react';
import { AlertTriangle, Camera, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const CitizenReport: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl">
                <div className="flex items-center mb-8">
                    <AlertTriangle className="h-8 w-8 text-red-500 mr-4" />
                    <h2 className="text-2xl font-bold text-white">{t.report.title}</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">{t.report.labels.name}</label>
                        <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-red-500 outline-none" placeholder={t.report.placeholders.name} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">{t.report.labels.location}</label>
                        <textarea rows={3} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-red-500 outline-none" placeholder={t.report.placeholders.location} />
                    </div>

                    <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-slate-500 transition-colors cursor-pointer">
                        <Camera className="h-10 w-10 text-slate-500 mx-auto mb-2" />
                        <p className="text-slate-400">{t.report.labels.upload}</p>
                        <p className="text-xs text-slate-600 mt-1">Supports JPG, PNG</p>
                    </div>

                    <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center">
                        <Send className="h-5 w-5 mr-2" />
                        {t.report.submit}
                    </button>
                </div>
            </div>
        </div>
    );
};
