import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, TrendingUp, AlertTriangle, CheckCircle, FileText, Loader, X } from 'lucide-react';
import { ImpactMatrix } from './ImpactMatrix';
import { DynamicQR } from './DynamicQR';
import { Certificate } from './Certificate';
import { AdminMap } from './AdminMap';
import { ExpiringLicenses } from './ExpiringLicenses';
import { TaxComplianceWidget } from './TaxComplianceWidget';

import type { Business, CitizenReport } from '../types/types';

interface DashboardProps {
    businesses: Business[];
    reports?: CitizenReport[];
    onUpdateStatus: (id: string, status: 'Verified' | 'Rejected') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ businesses, reports = [], onUpdateStatus }) => {
    const { user, logout } = useAuth();
    const [showCertificate, setShowCertificate] = React.useState(false);
    const [verifyingId, setVerifyingId] = React.useState<string | null>(null);
    const [reviewingId, setReviewingId] = React.useState<string | null>(null);
    const [verifyProgress, setVerifyProgress] = React.useState(0);
    const [adminShops, setAdminShops] = React.useState<any[]>([]);
    const [suspiciousData, setSuspiciousData] = React.useState<any>(null);
    const [recentScans, setRecentScans] = React.useState<any[]>([]);
    const [showTestKit, setShowTestKit] = React.useState(false);

    // --- DEMO UTILITIES ---
    const handleQuickSetup = async () => {
        const mockShops = [
            {
                tradeName: "Muthu Sweets",
                legalName: "Muthu Ganapathy",
                type: "Sole Proprietorship",
                category: "Food & Beverage",
                address: "12, North Street, Madurai",
                contactNumber: "9876543210",
                gstNumber: "33AAAAA1234A1Z5",
                lat: 9.9252,
                lng: 78.1198
            },
            {
                tradeName: "Chennai Silks",
                legalName: "Chennai Silks Pvt Ltd",
                type: "Private Limited",
                category: "Retail",
                address: "T. Nagar, Chennai",
                contactNumber: "9876543211",
                gstNumber: "33BBBBB1234B1Z5",
                lat: 13.0418,
                lng: 80.2341
            },
            {
                tradeName: "Saravana Bhavan",
                legalName: "Hotel Saravana Bhavan",
                type: "Partnership",
                category: "Food & Beverage",
                address: "Vadapalani, Chennai",
                contactNumber: "9876543212",
                gstNumber: "33CCCCC1234C1Z5",
                lat: 13.0500,
                lng: 80.2100
            }
        ];

        let addedCount = 0;
        for (const shop of mockShops) {
            try {
                // Check if already exists to avoid duplicates in demo
                if (businesses.some(b => b.tradeName === shop.tradeName)) continue;

                const response = await fetch('/api/businesses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...shop,
                        id: generateId(),
                        status: 'Verified', // Auto-verify for demo speed
                        registrationDate: new Date().toISOString(),
                        riskScore: 10
                    })
                });
                if (response.ok) addedCount++;
            } catch (e) {
                console.error("Demo setup failed for", shop.tradeName, e);
            }
        }
        if (addedCount > 0) {
            alert(`Demo Mode: ${addedCount} shops added \& verified! Refreshing...`);
            window.location.reload();
        } else {
            alert("Demo shops already exist!");
        }
    };

    // Helper to generate a random ID
    function generateId() {
        return Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // Fetch admin data for fraud detection
    React.useEffect(() => {
        if (user?.role === 'admin') {
            fetch('/api/admin/shops')
                .then(res => res.json())
                .then(data => setAdminShops(data.shops || []))
                .catch(err => console.error('Failed to fetch admin shops:', err));

            fetch('/api/admin/suspicious')
                .then(res => res.json())
                .then(data => setSuspiciousData(data))
                .catch(err => console.error('Failed to fetch suspicious data:', err));

            fetch('/api/admin/scans')
                .then(res => res.json())
                .then(data => setRecentScans(data.scans || []))
                .catch(err => console.error('Failed to fetch recent scans:', err));
        }
    }, [user]);

    if (!user) return null;

    // --- CASE 1: MUNICIPAL OFFICIAL (ADMIN) ---
    if (user.role === 'admin') {
        return (
            <div className="min-h-screen bg-slate-950 pb-20">
                <div className="bg-slate-900 border-b border-slate-800 pb-12 pt-12 px-4">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center">
                                <img src="./logo.png" alt="TN-MBNR Logo" className="h-10 w-auto mr-4" />
                                Municipal Official Dashboard
                            </h1>
                            <p className="text-slate-400 mt-2">Welcome back, Officer {user.name}</p>
                        </div>
                        <span className="bg-green-500/10 text-green-500 px-4 py-2 rounded-full border border-green-500/20 text-sm font-mono flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            ONLINE
                        </span>
                        <button
                            onClick={() => setShowTestKit(true)}
                            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 text-sm font-bold transition-all"
                        >
                            🖨️ Print Test Kit
                        </button>
                        <button
                            onClick={handleQuickSetup}
                            className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                        >
                            ⚡ Fast Demo
                        </button>
                    </div>
                </div>

                {/* TEST KIT MODAL */}
                {
                    showTestKit && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
                            <div className="bg-white text-slate-900 rounded-xl max-w-4xl w-full p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                                <div className="flex justify-between items-center mb-8 border-b pb-4">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter">Official Test Kit</h2>
                                    <button onClick={() => setShowTestKit(false)} className="p-2 hover:bg-slate-100 rounded-full">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* 1. VALID SHOP */}
                                    <div className="border-4 border-green-500 rounded-xl p-6 text-center">
                                        <div className="bg-green-100 text-green-800 font-bold py-1 px-3 rounded-full text-xs inline-block mb-4">SCENARIO: VALID</div>
                                        <div className="w-48 h-48 bg-slate-200 mx-auto mb-4 flex items-center justify-center">
                                            {/* In real app, render actual QR. Here using placeholder text but implemented logic would use QR component */}
                                            <DynamicQR businessId={businesses[0]?.id || "DEMO_VALID"} />
                                        </div>
                                        <h3 className="font-bold text-xl">{businesses[0]?.tradeName || "Valid Shop"}</h3>
                                        <p className="text-sm text-slate-500 mt-2">Scan to see verification success and XP gain.</p>
                                    </div>

                                    {/* 2. COUNTERFEIT / UNREGISTERED */}
                                    <div className="border-4 border-red-500 rounded-xl p-6 text-center">
                                        <div className="bg-red-100 text-red-800 font-bold py-1 px-3 rounded-full text-xs inline-block mb-4">SCENARIO: COUNTERFEIT</div>
                                        <div className="w-48 h-48 bg-slate-200 mx-auto mb-4 flex items-center justify-center relative overflow-hidden">
                                            <DynamicQR businessId="FAKE_ID_12345" />
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 transform -rotate-12">FAKE</div>
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-xl">Unregistered Shop</h3>
                                        <p className="text-sm text-slate-500 mt-2">Scan to trigger "Counterfeit/Invalid" alert.</p>
                                    </div>

                                    {/* 3. EXPIRED LICENSE */}
                                    <div className="border-4 border-yellow-500 rounded-xl p-6 text-center">
                                        <div className="bg-yellow-100 text-yellow-800 font-bold py-1 px-3 rounded-full text-xs inline-block mb-4">SCENARIO: EXPIRED</div>
                                        <div className="w-48 h-48 bg-slate-200 mx-auto mb-4 flex items-center justify-center opacity-50 grayscale">
                                            <DynamicQR businessId={businesses[1]?.id || "DEMO_EXPIRED"} />
                                        </div>
                                        <h3 className="font-bold text-xl">{businesses[1]?.tradeName || "Expired Shop"}</h3>
                                        <p className="text-sm text-slate-500 mt-2">Simulates an expired license (Backend logic required to force expiry).</p>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t flex justify-end">
                                    <button
                                        onClick={() => window.print()}
                                        className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition-all flex items-center"
                                    >
                                        🖨️ Print for Demo
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                <div className="max-w-7xl mx-auto px-4 -mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-slate-400 text-sm">Total Verifications</p>
                                    <h3 className="text-3xl font-bold text-white mt-2">1,248</h3>
                                </div>
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="mt-4 text-xs text-green-400 flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" /> +12% this week
                            </div>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-slate-400 text-sm">Pending Requests</p>
                                    <h3 className="text-3xl font-bold text-white mt-2">
                                        {businesses.filter(b => b.status === 'Pending').length}
                                    </h3>
                                </div>
                                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div className="mt-4 text-xs text-yellow-400 flex items-center">
                                Action Required
                            </div>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-slate-400 text-sm">Revenue Generated</p>
                                    <h3 className="text-3xl font-bold text-white mt-2">₹4.2L</h3>
                                </div>
                                <FileText className="h-6 w-6 text-blue-500" />
                            </div>
                            <div className="mt-4 text-xs text-slate-400">
                                Fiscal Year 2024-25
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
                        <div className="flex items-center mb-8">
                            <FileText className="h-6 w-6 text-yellow-500 mr-3" />
                            <h2 className="text-xl font-bold text-white">Pending License Approvals</h2>
                        </div>

                        <div className="space-y-4">
                            {businesses.filter(b => b.status === 'Pending').length === 0 ? (
                                <p className="text-slate-500 text-center py-8 bg-slate-950/50 rounded-xl border border-dashed border-slate-800">No pending registrations at this time.</p>
                            ) : (
                                businesses.filter(b => b.status === 'Pending').map(b => (
                                    <div key={b.id} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all">
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-white">{b.tradeName}</h3>
                                                    <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[10px] font-mono border border-yellow-500/20 rounded-full">PENDING</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 mt-4">
                                                    <div>
                                                        <p className="text-[10px] uppercase text-slate-500 tracking-wider">Owner</p>
                                                        <p className="text-sm text-slate-300">{b.legalName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase text-slate-500 tracking-wider">Type</p>
                                                        <p className="text-sm text-slate-300">{b.type}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => setReviewingId(b.id)}
                                                    className="w-full md:w-auto px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-lg transition-all"
                                                >
                                                    REVIEW
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Expiring Licenses Widget */}
                    <ExpiringLicenses businesses={businesses} />

                    <div className="mt-12 bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
                        <div className="flex items-center mb-8">
                            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                            <h2 className="text-xl font-bold text-white">Citizen Inquiries & Reports</h2>
                        </div>
                        <div className="space-y-4">
                            {reports.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">No active reports.</p>
                            ) : (
                                reports.map(r => (
                                    <div key={r.id} className="bg-slate-800/20 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                                        <div>
                                            <h4 className="text-white font-bold">{r.businessName}</h4>
                                            <p className="text-sm text-slate-400">{r.description}</p>
                                        </div>
                                        <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-all">
                                            ACT
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Fraud Detection Map */}
                    {suspiciousData && (
                        <div className="mt-12">
                            <AdminMap
                                shops={adminShops}
                                suspiciousScans={suspiciousData.scans || []}
                            />
                        </div>
                    )}

                    {/* Suspicious Scans Section */}
                    {suspiciousData && suspiciousData.scans && suspiciousData.scans.length > 0 && (
                        <div className="mt-12 bg-slate-900 rounded-2xl border border-red-500/20 p-8 shadow-2xl">
                            <div className="flex items-center mb-8">
                                <AlertTriangle className="h-6 w-6 text-red-500 mr-3 animate-pulse" />
                                <h2 className="text-xl font-bold text-white">Suspicious Scan Activity</h2>
                                <span className="ml-auto px-3 py-1 bg-red-500/10 text-red-500 text-sm font-bold border border-red-500/20 rounded-full">
                                    {suspiciousData.total_suspicious} Alerts
                                </span>
                            </div>
                            <div className="space-y-3">
                                {suspiciousData.scans.slice(0, 10).map((scan: any) => (
                                    <div key={scan.id} className="bg-slate-950/50 p-4 rounded-xl border border-red-500/10 hover:border-red-500/30 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-white font-bold">{scan.shop_name}</h4>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    <span className={`font-bold ${scan.result === 'COUNTERFEIT' ? 'text-red-500' :
                                                        scan.result === 'LOCATION_MISMATCH' ? 'text-orange-500' :
                                                            'text-yellow-500'
                                                        }`}>
                                                        {scan.result}
                                                    </span>
                                                    {scan.distance && ` • ${scan.distance.toFixed(2)}km away`}
                                                </p>
                                                <p className="text-[10px] text-slate-600 mt-1">
                                                    {new Date(scan.scanned_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <button className="px-3 py-1 bg-red-600/10 border border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white font-bold text-xs rounded-lg transition-all">
                                                INVESTIGATE
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent All Scans Table */}
                    <div className="mt-12 bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
                        <div className="flex items-center mb-8">
                            <TrendingUp className="h-6 w-6 text-purple-500 mr-3" />
                            <h2 className="text-xl font-bold text-white">Recent Scan Activity</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-400 text-sm">
                                        <th className="py-4 px-4">Time</th>
                                        <th className="py-4 px-4">Shop</th>
                                        <th className="py-4 px-4">Result</th>
                                        <th className="py-4 px-4">Distance</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {recentScans.length === 0 ? (
                                        <tr><td className="py-8 text-center text-slate-500" colSpan={4}>No scans recorded yet.</td></tr>
                                    ) : (
                                        recentScans.map((scan) => (
                                            <tr key={scan.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                                <td className="py-4 px-4 text-slate-300">{new Date(scan.scanned_at).toLocaleString()}</td>
                                                <td className="py-4 px-4 font-bold text-white">{scan.shop_name}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`font-bold ${scan.result === 'VALID' ? 'text-green-500' :
                                                        scan.result === 'COUNTERFEIT' ? 'text-red-500' :
                                                            'text-yellow-500'
                                                        }`}>
                                                        {scan.result}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-slate-400">
                                                    {scan.distance ? `${scan.distance.toFixed(2)} km` : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Risky Shops Widget */}
                    {suspiciousData && suspiciousData.top_risky_shops && suspiciousData.top_risky_shops.length > 0 && (
                        <div className="mt-12 bg-slate-900 rounded-2xl border border-orange-500/20 p-8 shadow-2xl">
                            <div className="flex items-center mb-8">
                                <AlertTriangle className="h-6 w-6 text-orange-500 mr-3" />
                                <h2 className="text-xl font-bold text-white">Top 10 Risky Shops</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {suspiciousData.top_risky_shops.map((shop: any, idx: number) => (
                                    <div key={shop.shop_id} className="bg-slate-950/50 p-4 rounded-xl border border-orange-500/10">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-orange-500/10 text-orange-500 font-black text-lg w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-white font-bold text-sm">{shop.shop_name}</h4>
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    <div className="bg-red-500/10 p-2 rounded">
                                                        <p className="text-[9px] text-slate-500 uppercase">Failed Scans</p>
                                                        <p className="text-sm font-bold text-red-500">{shop.failed_scans}</p>
                                                    </div>
                                                    <div className="bg-orange-500/10 p-2 rounded">
                                                        <p className="text-[9px] text-slate-500 uppercase">Risk Score</p>
                                                        <p className="text-sm font-bold text-orange-500">{shop.risk_score}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-8">
                        <ImpactMatrix />
                    </div>

                    {/* Review Modal */}
                    {reviewingId && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
                                {(() => {
                                    const b = businesses.find(item => item.id === reviewingId);
                                    if (!b) return null;
                                    return (
                                        <div className="p-8">
                                            <div className="flex justify-between items-start mb-8">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-white">{b.tradeName}</h3>
                                                    <p className="text-slate-400">ID: {b.id}</p>
                                                </div>
                                                <button onClick={() => setReviewingId(null)} className="text-slate-500 hover:text-white">
                                                    <X className="h-6 w-6" />
                                                </button>
                                            </div>

                                            {verifyingId === reviewingId ? (
                                                <div className="py-12 text-center">
                                                    <Loader className="h-12 w-12 text-yellow-500 animate-spin mx-auto mb-4" />
                                                    <div className="w-full bg-slate-950 h-2 rounded-full mt-4 overflow-hidden border border-slate-800">
                                                        <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: `${verifyProgress}%` }} />
                                                    </div>
                                                    <p className="text-yellow-500 font-mono text-xs mt-4">GENERATING CRYPTOGRAPHIC CERTIFICATE...</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Legal Name</p>
                                                            <p className="text-sm text-white">{b.legalName}</p>
                                                        </div>
                                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">GST Number</p>
                                                            <p className="text-sm text-white">{b.gstNumber || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <button
                                                            onClick={() => {
                                                                setVerifyingId(b.id);
                                                                setVerifyProgress(0);
                                                                const interval = setInterval(() => {
                                                                    setVerifyProgress(prev => {
                                                                        if (prev >= 100) {
                                                                            clearInterval(interval);
                                                                            onUpdateStatus(b.id, 'Verified');
                                                                            setVerifyingId(null);
                                                                            setReviewingId(null);
                                                                            return 100;
                                                                        }
                                                                        return prev + 10;
                                                                    });
                                                                }, 150);
                                                            }}
                                                            className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-all"
                                                        >
                                                            APPROVE & ISSUE LICENSE
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                onUpdateStatus(b.id, 'Rejected');
                                                                setReviewingId(null);
                                                            }}
                                                            className="px-6 bg-red-600/10 border border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white font-bold py-4 rounded-xl transition-all"
                                                        >
                                                            DECLINE
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- CASE 2: CITIZEN DASHBOARD ---
    if (user.role === 'citizen') {
        return (
            <div className="min-h-screen bg-slate-950 py-12 px-4">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50" />
                        <div className="flex items-center gap-6 mb-8">
                            <div className="bg-emerald-950 p-2 rounded-xl border border-emerald-500/20 shadow-neon-emerald">
                                <img src="./logo.png" alt="TN-MBNR Logo" className="h-16 w-auto" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Citizen Growth Hub</h1>
                                <p className="text-slate-400">Welcome back, {user.name}. Your contribution makes TN safer.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-green-500/30 transition-all group">
                                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2 group-hover:text-green-400">Security Reports</p>
                                <p className="text-3xl font-black text-white">{reports.length}</p>
                            </div>
                            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-yellow-500/30 transition-all group">
                                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2 group-hover:text-yellow-400">Trust Karma</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-3xl font-black text-yellow-500">120</p>
                                    <span className="text-yellow-500/50 font-mono text-xs">XP</span>
                                </div>
                            </div>
                            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-blue-500/30 transition-all group">
                                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2 group-hover:text-blue-400">Verified Checks</p>
                                <p className="text-3xl font-black text-white">14</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileText className="h-5 w-5 text-yellow-500" />
                                My Contribution Timeline
                            </h2>
                        </div>

                        {reports.length === 0 ? (
                            <div className="text-center py-20 bg-slate-950/50 rounded-2xl border border-dashed border-slate-800">
                                <AlertTriangle className="h-8 w-8 text-slate-700 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium italic">No reports submitted yet. Help us keep the city safe!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reports.map((report, idx) => (
                                    <div key={report.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 hover:border-green-500/20 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group animate-in slide-in-from-bottom duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                <h4 className="text-white font-bold group-hover:text-green-400 transition-colors uppercase tracking-tight">{report.businessName}</h4>
                                                <div className="flex gap-2">
                                                    {report.category && (
                                                        <span className="text-[9px] font-black text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 uppercase tracking-widest">{report.category}</span>
                                                    )}
                                                    {report.severity && (
                                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${report.severity === 'Urgent' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                            report.severity === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                                'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                            }`}>
                                                            {report.severity}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-400 max-w-md line-clamp-2">{report.description}</p>
                                        </div>
                                        <div className="flex flex-col items-end shrink-0">
                                            <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold border border-yellow-500/20 rounded-full uppercase tracking-tighter">
                                                {report.status || 'Under Review'}
                                            </span>
                                            <p className="text-[9px] text-slate-600 mt-2 font-mono italic opacity-60">Submitted: {new Date(report.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={logout}
                        className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-all font-bold group flex items-center justify-center gap-2"
                    >
                        <X className="h-4 w-4 group-hover:scale-125 transition-transform" /> Sign Out from Citizen Portal
                    </button>
                </div>
            </div>
        );
    }

    // --- CASE 3: BUSINESS DASHBOARD (DEFAULT) ---
    const currentBusiness = businesses.find(b =>
        b.email === user.email || b.id === user.businessId
    );

    if (currentBusiness?.status === 'Pending') {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="max-w-xl w-full bg-slate-900 rounded-3xl border border-yellow-500/20 p-12 text-center shadow-2xl">
                    <Loader className="h-16 w-16 text-yellow-500 animate-spin mx-auto mb-8" />
                    <h2 className="text-3xl font-bold text-white mb-4">Registration Pending</h2>
                    <p className="text-slate-400 mb-8 font-medium">Your application for <span className="text-yellow-500 font-bold">{currentBusiness.tradeName}</span> is being reviewed by the Municipal Board.</p>
                    <button onClick={logout} className="text-slate-500 hover:text-slate-300 font-bold underline transition-all">Sign Out</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl border border-slate-700 p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="flex flex-col md:flex-row justify-between gap-10">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20">
                                    <Building2 className="h-10 w-10 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{currentBusiness?.tradeName || 'Enterprise'}</h2>
                                    <p className="text-slate-500 font-mono text-xs">ID: {currentBusiness?.id || 'MBNR-2024-DEMO'}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mb-8">
                                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20 rounded-full uppercase">Verified</span>
                                <span className="px-3 py-1 bg-slate-700/50 text-slate-300 text-[10px] font-bold rounded-full uppercase italic">{currentBusiness?.type}</span>
                                {currentBusiness?.website && (
                                    <a href={currentBusiness.website} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20 rounded-full hover:bg-blue-500/20 transition-all flex items-center">
                                        🌐 Website
                                    </a>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Scans Today</p>
                                    <p className="text-2xl font-black text-white">42</p>
                                </div>
                                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Trust Karma</p>
                                    <p className="text-2xl font-black text-green-400">98%</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="bg-white p-2 rounded-2xl shadow-neon-yellow transform hover:scale-105 transition-transform">
                                <DynamicQR businessId={currentBusiness?.id || 'DEMO'} />
                            </div>
                            <p className="mt-4 text-[10px] font-mono text-slate-500 uppercase font-bold tracking-tighter">Live Dynamic Token</p>
                            <button onClick={() => setShowCertificate(true)} className="mt-6 text-yellow-500 hover:text-yellow-400 font-bold text-sm underline underline-offset-4 decoration-yellow-500/30">View Certificate</button>
                        </div>
                    </div>
                    {/* Tax Compliance Widget */}
                    {currentBusiness && (
                        <div className="mt-8">
                            <TaxComplianceWidget business={currentBusiness} />
                        </div>
                    )}
                </div>

                {showCertificate && currentBusiness && (
                    <Certificate
                        business={currentBusiness}
                        onClose={() => setShowCertificate(false)}
                    />
                )}

                <div className="text-center">
                    <button onClick={logout} className="text-slate-500 hover:text-white text-sm font-bold uppercase tracking-widest transition-all">Logout and Secure Identity</button>
                </div>
            </div>
        </div>
    );
};
