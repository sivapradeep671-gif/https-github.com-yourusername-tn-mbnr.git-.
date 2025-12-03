import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Shield, CheckCircle, AlertTriangle, Trophy, Star, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const QRScanner = () => {
    const { t } = useLanguage();
    const [scanResult, setScanResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [xp, setXp] = useState(0);
    const [showArOverlay] = useState(true);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        scanner.render(onScanSuccess, onScanFailure);

        function onScanSuccess(decodedText: string, _decodedResult: any) {
            try {
                const data = JSON.parse(decodedText);
                setScanResult(data);
                setXp(prev => prev + 50); // Award XP
                scanner.clear();
            } catch (e) {
                setError("Invalid QR Code format");
            }
        }

        function onScanFailure(_error: any) {
            // handle scan failure, usually better to ignore and keep scanning.
            // console.warn(`Code scan error = ${error}`);
        }

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5-qrcode scanner. ", error);
            });
        };
    }, []);

    const resetScan = () => {
        setScanResult(null);
        setError(null);
        window.location.reload(); // Simple way to restart scanner
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl text-center">
                <div className="flex items-center justify-center mb-8">
                    <Shield className="h-8 w-8 text-yellow-500 mr-4" />
                    <h2 className="text-2xl font-bold text-white">{t.nav.scan_qr}</h2>
                </div>

                {!scanResult && !error && (
                    <div className="max-w-md mx-auto bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div id="reader" className="w-full relative overflow-hidden rounded-lg">
                            {showArOverlay && (
                                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center">
                                    <div className="w-64 h-64 border-2 border-yellow-500/50 rounded-lg relative animate-pulse">
                                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-500"></div>
                                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-500"></div>
                                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-500"></div>
                                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-500"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Zap className="h-8 w-8 text-yellow-500/30 animate-ping" />
                                        </div>
                                    </div>
                                    <p className="text-yellow-500 font-mono text-xs mt-4 bg-black/50 px-2 py-1 rounded">AR SCANNER ACTIVE</p>
                                </div>
                            )}
                        </div>
                        <p className="text-slate-400 mt-4 text-sm">Point your camera at a TN-MBNR Business QR Code</p>
                    </div>
                )}

                {scanResult && (
                    <div className="mt-8 p-6 rounded-xl bg-green-900/20 border border-green-500/30 animate-fade-in">
                        <div className="flex items-center justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 animate-pulse"></div>
                                <CheckCircle className="h-20 w-20 text-green-500 relative z-10" />
                            </div>
                        </div>

                        <div className="flex items-center justify-center space-x-2 mb-6 animate-bounce">
                            <Trophy className="h-6 w-6 text-yellow-400" />
                            <span className="text-2xl font-bold text-yellow-400">+{xp} XP GAINED</span>
                            <Star className="h-6 w-6 text-yellow-400" />
                        </div>

                        <h3 className="text-2xl font-bold text-green-400 mb-2">{t.register.qr.title}</h3>
                        <div className="text-left max-w-sm mx-auto bg-slate-950 p-6 rounded-lg border border-slate-800 mt-6">
                            <div className="mb-4">
                                <label className="text-xs text-slate-500 uppercase tracking-wider">Business Name</label>
                                <p className="text-lg font-bold text-white">{scanResult.name}</p>
                            </div>
                            <div className="mb-4">
                                <label className="text-xs text-slate-500 uppercase tracking-wider">Status</label>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                    {scanResult.status}
                                </span>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase tracking-wider">Business ID</label>
                                <p className="text-xs font-mono text-slate-400 break-all">{scanResult.id}</p>
                            </div>
                        </div>
                        <button
                            onClick={resetScan}
                            className="mt-8 text-slate-400 hover:text-white underline"
                        >
                            Scan Another
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mt-8 p-6 rounded-xl bg-red-900/20 border border-red-500/30">
                        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-red-400 mb-2">Scan Failed</h3>
                        <p className="text-slate-300">{error}</p>
                        <button
                            onClick={resetScan}
                            className="mt-6 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
