import React from 'react';
import { Shield, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
    currentView: string;
    setCurrentView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
    const { t, language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ta' : 'en');
    };

    return (
        <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('HOME')}>
                        <Shield className="h-8 w-8 text-yellow-500" />
                        <span className="ml-2 text-xl font-bold tracking-wider">TN-MBNR</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-baseline space-x-4">
                            <button
                                onClick={() => setCurrentView('HOME')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'HOME' ? 'bg-slate-800 text-yellow-500' : 'text-slate-300 hover:text-white'
                                    }`}
                            >
                                {t.nav.home}
                            </button>
                            <button
                                onClick={() => setCurrentView('REGISTER')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'REGISTER' ? 'bg-slate-800 text-yellow-500' : 'text-slate-300 hover:text-white'
                                    }`}
                            >
                                {t.nav.register}
                            </button>
                            <button
                                onClick={() => setCurrentView('MAP')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'MAP' ? 'bg-slate-800 text-yellow-500' : 'text-slate-300 hover:text-white'
                                    }`}
                            >
                                {t.nav.map}
                            </button>
                            <button
                                onClick={() => setCurrentView('REPORT')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'REPORT' ? 'bg-slate-800 text-yellow-500' : 'text-slate-300 hover:text-white'
                                    }`}
                            >
                                {t.nav.report}
                            </button>
                            <button
                                onClick={() => setCurrentView('SCAN')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'SCAN' ? 'bg-slate-800 text-yellow-500' : 'text-slate-300 hover:text-white'
                                    }`}
                            >
                                {t.nav.scan_qr}
                            </button>
                            <button
                                onClick={() => setCurrentView('LEDGER')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'LEDGER' ? 'bg-slate-800 text-yellow-500' : 'text-slate-300 hover:text-white'
                                    }`}
                            >
                                Ledger
                            </button>
                        </div>

                        <button
                            onClick={toggleLanguage}
                            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Switch Language"
                        >
                            <Languages className="h-5 w-5 mr-1" />
                            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

