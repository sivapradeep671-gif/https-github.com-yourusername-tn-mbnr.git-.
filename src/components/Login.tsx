import React, { useState } from 'react';
import { useAuth, type UserRole } from '../context/AuthContext';
import { Shield, Building2, UserCircle, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
    onLoginSuccess: (role: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const { login } = useAuth();
    const [role, setRole] = useState<UserRole>('citizen');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            let defaultEmail = 'guest@tn.gov.in';
            if (role === 'admin') defaultEmail = 'admin@mbnr.com';
            if (role === 'business') defaultEmail = 'owner@business.com';

            login(email || defaultEmail, role);
            setIsLoading(false);
            onLoginSuccess(role);
        }, 1500);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[100px]" />

            <div className="max-w-md w-full space-y-8 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl relative z-10">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                        {role === 'admin' ? (
                            <Shield className="h-8 w-8 text-yellow-500" />
                        ) : role === 'citizen' ? (
                            <UserCircle className="h-8 w-8 text-green-500" />
                        ) : (
                            <Building2 className="h-8 w-8 text-blue-500" />
                        )}
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">
                        {role === 'admin' ? 'Official Portal' : role === 'citizen' ? 'Citizen Portal' : 'Business Portal'}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        {role === 'admin'
                            ? 'Secure access for Municipal Officers'
                            : role === 'citizen'
                                ? 'Verify shops and report grievances'
                                : 'Manage your Business Identity'}
                    </p>
                </div>

                {/* Role Switcher */}
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                        onClick={() => setRole('citizen')}
                        className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${role === 'citizen'
                            ? 'bg-slate-800 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <UserCircle className="w-4 h-4 mr-2" />
                        Citizen
                    </button>
                    <button
                        onClick={() => setRole('business')}
                        className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${role === 'business'
                            ? 'bg-slate-800 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <Building2 className="w-4 h-4 mr-2" />
                        Business
                    </button>
                    <button
                        onClick={() => setRole('admin')}
                        className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${role === 'admin'
                            ? 'bg-slate-800 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <Shield className="w-4 h-4 mr-2" />
                        Official
                    </button>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div className="relative">
                            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1 mb-1 block">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserCircle className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 bg-slate-950 border border-slate-800 rounded-lg py-3 text-white placeholder-slate-600 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                                    placeholder={role === 'admin' ? 'admin@mbnr.gov.in' : role === 'citizen' ? 'citizen@tn.gov.in' : 'owner@business.com'}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider ml-1 mb-1 block">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 bg-slate-950 border border-slate-800 rounded-lg py-3 text-white placeholder-slate-600 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 bg-slate-950 border-slate-700 rounded text-yellow-500 focus:ring-yellow-500"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-slate-400">
                                Remember me
                            </label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="font-medium text-yellow-500 hover:text-yellow-400">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-slate-900 bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Authenticating...' : 'Sign In'}
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Citizen Registration Link */}
                    {role === 'citizen' && (
                        <div className="text-center mt-6 pt-6 border-t border-slate-800">
                            <p className="text-sm text-slate-500">
                                New to TrustReg?{' '}
                                <button
                                    type="button"
                                    //@ts-ignore - Handled in App
                                    onClick={() => window.onOpenCitizenReg?.()}
                                    className="text-yellow-500 hover:text-yellow-400 font-bold"
                                >
                                    Register as Citizen
                                </button>
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};
