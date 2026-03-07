import React from 'react';
import { Languages, Menu, X, Zap, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import { useAuth } from '../context/AuthContext';

interface NavbarProps {
    currentView: string;
    setCurrentView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
    const { t, language, toggleLanguage } = useLanguage();
    const { isAuthenticated, user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        setCurrentView('HOME');
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 backdrop-blur-md bg-slate-900/80 border-b border-slate-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section */}
                    <div className="flex items-center flex-shrink-0 cursor-pointer group" onClick={() => setCurrentView('HOME')}>
                        <div className="mr-3 group-hover:scale-105 transition-transform duration-300">
                            <img src="./logo.png" alt="TN-MBNR Logo" className="h-10 w-auto" />
                        </div>
                        <div className="flex flex-col border-l border-slate-700 pl-3">
                            <span className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent leading-none">
                                TN-MBNR
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 tracking-tighter mt-1">
                                TRUSTREG TN PILOT
                            </span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {['HOME', 'REGISTER', 'MAP', 'REGISTRY', 'REPORT', 'SCAN'].filter(view => {
                                if (!user) return ['HOME', 'MAP', 'REGISTRY', 'SCAN'].includes(view);
                                if (user.role === 'citizen') return ['HOME', 'MAP', 'REGISTRY', 'REPORT', 'SCAN'].includes(view);
                                if (user.role === 'business') return ['HOME', 'REGISTER', 'MAP', 'REGISTRY', 'SCAN'].includes(view);
                                return true; // admin sees all
                            }).map((view) => {
                                const labelMap: Record<string, string> = {
                                    HOME: t.nav.home,
                                    REGISTER: t.nav.register,
                                    MAP: t.nav.map,
                                    REPORT: t.nav.report,
                                    SCAN: t.nav.scan_qr,
                                    REGISTRY: 'Registry',
                                };
                                return (
                                    <button
                                        key={view}
                                        onClick={() => setCurrentView(view)}
                                        className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${currentView === view
                                            ? 'text-yellow-500 text-glow-yellow'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                                            }`}
                                    >
                                        {labelMap[view] || view}
                                        {currentView === view && (
                                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)] animate-in fade-in zoom-in duration-300" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Side Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Village Proofing: Offline Sync Status */}
                        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 mr-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">Sync: OK</span>
                            <Zap className="h-3 w-3 text-yellow-500 ml-1" />
                        </div>

                        {/* Language Switcher */}
                        <button
                            onClick={toggleLanguage}
                            className="p-2 text-slate-400 hover:text-white transition-colors"
                            title={language === 'en' ? 'Switch to Tamil' : 'Switch to English'}
                        >
                            <Languages className="h-5 w-5" />
                        </button>

                        {/* Login/Dashboard Button */}
                        {!isAuthenticated ? (
                            <button
                                onClick={() => setCurrentView('LOGIN')}
                                className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-4 py-2 rounded-lg text-sm font-bold transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
                            >
                                Login
                            </button>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentView('DASHBOARD')}
                                    className="bg-slate-800 text-yellow-500 px-4 py-2 rounded-lg text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-all"
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all transform hover:scale-105"
                                    title="Logout"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        {/* Mobile Language Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="p-2 mr-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <Languages className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-800 bg-slate-900 animate-fade-in">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {['HOME', 'REGISTER', 'MAP', 'REGISTRY', 'REPORT', 'SCAN'].filter(view => {
                            if (!user) return ['HOME', 'MAP', 'REGISTRY', 'SCAN'].includes(view);
                            if (user.role === 'citizen') return ['HOME', 'MAP', 'REGISTRY', 'REPORT', 'SCAN'].includes(view);
                            if (user.role === 'business') return ['HOME', 'REGISTER', 'MAP', 'REGISTRY', 'SCAN'].includes(view);
                            return true;
                        }).map((view) => {
                            const labelMap: Record<string, string> = {
                                HOME: t.nav.home,
                                REGISTER: t.nav.register,
                                MAP: t.nav.map,
                                REPORT: t.nav.report,
                                SCAN: t.nav.scan_qr,
                                REGISTRY: 'Registry',
                            };
                            return (
                                <button
                                    key={view}
                                    onClick={() => {
                                        setCurrentView(view);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${currentView === view
                                        ? 'bg-slate-800 text-yellow-500'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                        }`}
                                >
                                    {labelMap[view] || view}
                                </button>
                            );
                        })}

                        {/* Login/Dashboard for Mobile */}
                        {!isAuthenticated ? (
                            <button
                                onClick={() => {
                                    setCurrentView('LOGIN');
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`block w-full text-left px-3 py-2 rounded-md text-base font-bold ${currentView === 'LOGIN' ? 'bg-yellow-500 text-slate-900' : 'text-yellow-500 hover:text-yellow-400'
                                    }`}
                            >
                                Login
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setCurrentView('DASHBOARD');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${currentView === 'DASHBOARD' ? 'bg-slate-800 text-yellow-500' : 'text-slate-300 hover:text-white'
                                        }`}
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center px-3 py-2 rounded-md text-base font-bold text-red-500 hover:text-red-400 hover:bg-slate-800"
                                >
                                    <LogOut className="h-5 w-5 mr-2" />
                                    <span>Logout</span>
                                </button>
                            </>
                        )}

                        {/* Language Switcher Mobile */}
                        <button
                            onClick={() => {
                                toggleLanguage();
                                setIsMobileMenuOpen(false);
                            }}
                            className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                        >
                            <Languages className="h-5 w-5 mr-2" />
                            <span>{language === 'en' ? 'Switch to Tamil' : 'Switch to English'}</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

