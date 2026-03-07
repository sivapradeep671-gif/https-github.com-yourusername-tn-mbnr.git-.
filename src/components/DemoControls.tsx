import React, { useState } from 'react';
import { Database, QrCode, X, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const DemoControls: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [showQRs, setShowQRs] = useState(false);

    const handleSeedData = async () => {
        if (!confirm("⚠️ This will WIPE current data and reset to 3 demo shops. Continue?")) return;

        setLoading(true);
        try {
            const res = await fetch('/api/demo/seed', { method: 'POST' });
            if (res.ok) {
                alert("Demo Data Loaded! App will reload.");
                window.location.reload();
            } else {
                alert("Failed to load demo data.");
            }
        } catch (e) {
            alert("Error connecting to server.");
        } finally {
            setLoading(false);
        }
    };

    const demoQRs = [
        { id: 'DEMO-001', name: 'Sri Krishna Sweets', type: 'Valid' },
        { id: 'DEMO-002', name: 'A2B Adyar', type: 'Valid' },
        { id: 'FAKE-001', name: 'Counterfeit Shop', type: 'Counterfeit' } // Fake ID not in DB
    ];

    return (
        <>
            {/* Floating Toggle Button */}
            <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
                <button
                    onClick={() => setShowQRs(true)}
                    className="bg-white text-slate-900 p-3 rounded-full shadow-lg border border-slate-200 hover:bg-slate-100 transition-all"
                    title="Show Test QRs"
                >
                    <QrCode className="h-6 w-6" />
                </button>
                <button
                    onClick={handleSeedData}
                    disabled={loading}
                    className="bg-slate-900 text-yellow-500 p-3 rounded-full shadow-lg border border-yellow-500/30 hover:bg-slate-800 transition-all"
                    title="Reset Demo Data"
                >
                    {loading ? <RefreshCw className="h-6 w-6 animate-spin" /> : <Database className="h-6 w-6" />}
                </button>
            </div>

            {/* QR Code Modal */}
            {showQRs && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative">
                        <button
                            onClick={() => setShowQRs(false)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                            <QrCode className="mr-2" /> Test QR Codes
                        </h3>

                        <div className="grid grid-cols-1 gap-6 max-h-[60vh] overflow-y-auto">
                            {demoQRs.map(qr => (
                                <div key={qr.id} className="flex items-center gap-4 p-4 border rounded-xl bg-slate-50">
                                    <div className="bg-white p-2 border rounded">
                                        <QRCodeSVG value={qr.id} size={80} level="M" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{qr.name}</p>
                                        <p className="text-xs font-mono text-slate-500 mb-1">ID: {qr.id}</p>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${qr.type === 'Valid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {qr.type.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="text-slate-500 text-xs mt-6 text-center">
                            Scan these with the app's QR Scanner to test verification.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};
