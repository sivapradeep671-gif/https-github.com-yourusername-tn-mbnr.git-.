import React, { useState } from 'react';
import { User, Phone, MapPin, Shield, ArrowRight, CheckCircle } from 'lucide-react';


interface CitizenRegistrationProps {
    onComplete: () => void;
}

export const CitizenRegistration: React.FC<CitizenRegistrationProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        area: '',
        ward: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 2) {
            setStep(step + 1);
        } else {
            // Success state
            setStep(3);
            setTimeout(() => {
                onComplete();
            }, 2000);
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-12">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
                {/* Progress bar */}
                <div className="absolute top-0 left-0 h-1 bg-yellow-500 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>

                <div className="text-center mb-8">
                    <div className="mx-auto h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                        <User className="h-8 w-8 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Citizen Registration</h2>
                    <p className="text-slate-400 text-sm mt-2">Join the Trust Network to verify businesses and earn rewards.</p>
                </div>

                {step === 3 ? (
                    <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">Registration Complete!</h3>
                        <p className="text-slate-400 mt-2">Redirecting to home...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 && (
                            <div className="space-y-4 animate-in slide-in-from-right duration-300">
                                <div className="relative">
                                    <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1 mb-1 block">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="block w-full pl-10 bg-slate-950 border border-slate-800 rounded-xl py-3 text-white placeholder-slate-600 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1 mb-1 block">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            className="block w-full pl-10 bg-slate-950 border border-slate-800 rounded-xl py-3 text-white placeholder-slate-600 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in slide-in-from-right duration-300">
                                <div className="relative">
                                    <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1 mb-1 block">Area / Locality</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.area}
                                            onChange={e => setFormData(prev => ({ ...prev, area: e.target.value }))}
                                            className="block w-full pl-10 bg-slate-950 border border-slate-800 rounded-xl py-3 text-white placeholder-slate-600 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                                            placeholder="e.g., Anna Nagar"
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1 mb-1 block">Ward Number (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.ward}
                                        onChange={e => setFormData(prev => ({ ...prev, ward: e.target.value }))}
                                        className="block w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                                        placeholder="Ward ID"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full flex justify-center items-center py-4 px-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 text-sm font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-yellow-500/20"
                        >
                            {step === 1 ? 'Next Step' : 'Complete Registration'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </button>

                        <div className="flex items-center gap-3 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                            <Shield className="h-5 w-5 text-slate-500" />
                            <p className="text-[10px] text-slate-500 leading-tight">
                                Your data is secured on the blockchain. We value your privacy and only use it for municipal verification.
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
