/**
 * TN-MBNR Hero Brand Component
 */
import React from 'react';
import { Shield, Zap, ArrowRight, Smartphone, MapPin, Search, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DemoScreens } from './DemoScreens';

export const Hero: React.FC<{ onRegister: () => void; onScan: () => void; onCitizenRegister: () => void }> = ({ onRegister, onScan, onCitizenRegister }) => {
    const { t } = useLanguage();

    return (
        <section className="bg-slate-950 text-white min-h-screen relative overflow-hidden" aria-labelledby="hero-title">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none" aria-hidden="true">
                <div className="aurora-blob w-[60%] h-[60%] -top-[20%] -left-[10%] bg-blue-600/30" />
                <div className="aurora-blob w-[50%] h-[50%] -bottom-[10%] -right-[10%] bg-yellow-500/20" />
                <div className="aurora-blob w-[40%] h-[40%] top-[30%] left-[20%] bg-purple-600/10" />
            </div>

            <div className="section-container">
                <header className="text-center max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex flex-col items-center mb-8">
                        <img src="./logo.png" alt="TN-MBNR - TrustReg Tamil Nadu Pilot Logo" className="h-40 w-auto mb-6 animate-float" />
                        <div className="inline-flex items-center px-4 py-2 rounded-full glass-card">
                            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2 shadow-neon-yellow animate-pulse"></span>
                            <span className="text-yellow-500 font-mono-tech uppercase tracking-widest text-xs">TrustReg TN Pilot</span>
                        </div>
                    </div>

                    <h1 id="hero-title" className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 text-transparent bg-clip-text leading-tight">
                        {t.hero.title_prefix} — <span className="text-yellow-500">{t.hero.title_suffix}</span>
                    </h1>

                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed italic">
                        {t.hero.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={onRegister}
                            className="w-full sm:w-auto px-10 py-5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-display rounded-2xl transition-all transform hover:scale-105 shadow-neon-yellow flex items-center justify-center group relative overflow-hidden"
                            aria-label="Register your business"
                        >
                            <Shield className="mr-2 h-5 w-5" />
                            {t.hero.cta_register}
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={onScan}
                            className="w-full sm:w-auto px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl border border-slate-800 transition-all flex items-center justify-center backdrop-blur-xl hover:border-blue-500/30 shadow-xl"
                            aria-label="Verify a shop using QR scanner"
                        >
                            <Search className="mr-2 h-5 w-5 text-yellow-500" />
                            Verify a Shop
                        </button>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={onCitizenRegister}
                            className="text-slate-500 hover:text-yellow-500 text-sm font-medium tracking-wide underline decoration-slate-800 underline-offset-8 hover:decoration-yellow-500/30 transition-all"
                        >
                            New Citizen? Register for Trust Network Benefits
                        </button>
                    </div>
                </header>

                <section className="py-20 border-y border-slate-900/50 mb-20" aria-labelledby="how-it-works">
                    <h2 id="how-it-works" className="text-3xl font-bold text-center mb-16">How the Trust Network Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <article className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-slate-800 group-hover:border-yellow-500/50 transition-colors">
                                <Smartphone className="h-10 w-10 text-yellow-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">1. Register Shop</h3>
                            <p className="text-slate-400 text-sm">Upload business details to receive your dynamic, tamper-resistant QR code.</p>
                        </article>
                        <article className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-slate-800 group-hover:border-blue-500/50 transition-colors">
                                <Search className="h-10 w-10 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">2. Citizen Scan</h3>
                            <p className="text-slate-400 text-sm">Customers scan with their phone. The app checks GPS and token authenticity instantly.</p>
                        </article>
                        <article className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-slate-800 group-hover:border-green-500/50 transition-colors">
                                <Shield className="h-10 w-10 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">3. Clear Messages</h3>
                            <p className="text-slate-400 text-sm">Citizens see <span className="text-green-400">“Verified”</span> only for genuine shops. Copied or misused QRs show a red warning.</p>
                        </article>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <section className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 hover:border-yellow-500/30 transition-all">
                        <div className="flex items-start gap-4">
                            <Zap className="h-8 w-8 text-yellow-500 shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold mb-4">Dynamic QR</h3>
                                <p className="text-slate-400 leading-relaxed mb-4">
                                    Every QR code has a short life (about 24 hours). Old screenshots and printouts automatically become invalid.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition-all">
                        <div className="flex items-start gap-4">
                            <MapPin className="h-8 w-8 text-blue-500 shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold mb-4">Location Lock</h3>
                                <p className="text-slate-400 leading-relaxed mb-4">
                                    Each QR is tied to one shop’s GPS location. If someone copies the QR to another shop, our system detects a location mismatch.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <section className="bg-yellow-500/5 rounded-3xl border border-yellow-500/10 p-12 mb-20" aria-labelledby="alerts-title">
                    <div className="max-w-3xl">
                        <h2 id="alerts-title" className="text-3xl font-bold mb-8">Suspicious Scan Alerts</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 p-1 bg-red-500/10 rounded-full">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                </div>
                                <p className="text-lg text-slate-400">
                                    When the same QR is scanned from far-away places or too many times, it is flagged as suspicious and shown with a warning to citizens.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 text-center" aria-labelledby="demo-title">
                    <h2 id="demo-title" className="text-3xl font-bold mb-4">Experience the Verification Flow</h2>
                    <p className="text-slate-500 mb-12">Previewing live citizen scan results</p>
                    <DemoScreens />
                </section>

                <footer className="text-center pb-20">
                    <button
                        onClick={onRegister}
                        className="px-12 py-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-3xl border border-slate-700 transition-all hover:border-yellow-500 group"
                        aria-label="Try the Interactive Prototype"
                    >
                        <Zap className="inline-block mr-2 h-6 w-6 text-yellow-500 group-hover:scale-125 transition-transform" />
                        Try the Interactive Prototype
                    </button>
                </footer>
            </div>
        </section>
    );
};