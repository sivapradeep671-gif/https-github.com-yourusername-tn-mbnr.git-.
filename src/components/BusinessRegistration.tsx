import React, { useState, useEffect } from 'react';
import { Shield, Save, AlertTriangle, CheckCircle, Loader, Building2, Upload, Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import type { Business, AnalysisResult } from '../types/types';
import { useLanguage } from '../context/LanguageContext';

interface BusinessRegistrationProps {
    existingBusinesses: Business[];
    onRegister: (business: Business) => void;
}

export const BusinessRegistration: React.FC<BusinessRegistrationProps> = ({ existingBusinesses, onRegister }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<Partial<Business>>({
        legalName: '',
        tradeName: '',
        type: 'Sole Proprietorship',
        address: '',
        branchName: '',
        contactNumber: '',
        email: '',
        gstNumber: '',
        category: '',
        proofOfAddress: '',
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [termsError, setTermsError] = useState(false);
    const [draftFound, setDraftFound] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [registeredBusiness, setRegisteredBusiness] = useState<Business | null>(null);

    useEffect(() => {
        const savedDraft = localStorage.getItem('tn_mbnr_registration_draft');
        if (savedDraft) {
            setDraftFound(true);
        }
    }, []);

    const loadDraft = () => {
        const savedDraft = localStorage.getItem('tn_mbnr_registration_draft');
        if (savedDraft) {
            const parsed = JSON.parse(savedDraft);
            setFormData(parsed.data);
            setDraftFound(false);
        }
    };

    const discardDraft = () => {
        localStorage.removeItem('tn_mbnr_registration_draft');
        setDraftFound(false);
    };

    const saveDraft = () => {
        const draft = {
            data: formData,
            timestamp: new Date().toISOString(),
        };
        localStorage.setItem('tn_mbnr_registration_draft', JSON.stringify(draft));
        alert('Draft saved successfully!');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setAnalysisResult(null);

        // Duplicate Check
        const isDuplicateName = existingBusinesses.some(b =>
            b.legalName.toLowerCase() === formData.legalName?.toLowerCase() ||
            b.tradeName.toLowerCase() === formData.tradeName?.toLowerCase()
        );

        if (isDuplicateName) {
            setTimeout(() => {
                setAnalysisResult({
                    isSafe: false,
                    riskLevel: 'High',
                    message: 'Business Name already registered.',
                });
                setIsAnalyzing(false);
            }, 1500);
            return;
        }

        // AI Analysis via Backend
        try {
            const response = await fetch('/api/verify-business', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    businessName: formData.tradeName,
                    type: formData.type
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setAnalysisResult({
                    isSafe: data.verified,
                    riskLevel: data.confidence > 0.7 ? 'Low' : 'High',
                    message: data.analysis || (data.verified ? 'Business name verified successfully.' : 'Potential issues detected.'),
                });
            } else {
                throw new Error('Verification failed');
            }
        } catch (error) {
            console.error("AI Verification failed:", error);
            // Fallback Mock Analysis
            const riskyNames = ['starbucks', 'a2b', 'dominos', 'kfc'];
            const isRisky = riskyNames.some(name => formData.tradeName?.toLowerCase().includes(name));

            setAnalysisResult({
                isSafe: !isRisky,
                riskLevel: isRisky ? 'High' : 'Low',
                similarBrands: isRisky ? ['Famous Brand'] : [],
                message: isRisky ? 'Potential trademark infringement detected (Offline Mode).' : 'Trade name appears safe (Offline Mode).',
            });
        }

        setIsAnalyzing(false);
    };

    const initiatePayment = () => {
        if (!termsAccepted) {
            setTermsError(true);
            return;
        }
        setTermsError(false);
        setIsPaymentProcessing(true);

        setTimeout(() => {
            setIsPaymentProcessing(false);
            const newBusiness: Business = {
                ...formData as Business,
                id: crypto.randomUUID(),
                status: 'Verified',
                registrationDate: new Date().toISOString(),
                riskScore: 10,
            };
            onRegister(newBusiness);
            setRegisteredBusiness(newBusiness);
            localStorage.removeItem('tn_mbnr_registration_draft');
        }, 2000);
    };

    if (registeredBusiness) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                <div className="bg-slate-900 rounded-2xl border border-green-500/30 p-12 shadow-xl">
                    <div className="flex justify-center mb-6">
                        <CheckCircle className="h-20 w-20 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">{t.register.success}</h2>
                    <p className="text-slate-400 mb-8">
                        {registeredBusiness.tradeName} has been verified and registered on the blockchain.
                    </p>

                    <div className="bg-white p-6 rounded-xl inline-block mb-8">
                        <QRCodeCanvas
                            value={JSON.stringify({
                                id: registeredBusiness.id,
                                name: registeredBusiness.tradeName,
                                status: registeredBusiness.status
                            })}
                            size={200}
                            level={"H"}
                        />
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-white mb-2">{t.register.qr.title}</h3>
                        <p className="text-slate-400">{t.register.qr.desc}</p>
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold px-8 py-3 rounded-lg transition-all flex items-center mx-auto"
                    >
                        <Download className="h-5 w-5 mr-2" />
                        {t.register.qr.download}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            {draftFound && (
                <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-8 flex items-center justify-between">
                    <div className="flex items-center">
                        <Save className="h-5 w-5 text-blue-400 mr-3" />
                        <span className="text-blue-200">Found a saved draft from a previous session.</span>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={loadDraft} className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded">Load Draft</button>
                        <button onClick={discardDraft} className="text-sm text-slate-400 hover:text-white px-3 py-1">Discard</button>
                    </div>
                </div>
            )}

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl">
                <div className="flex items-center mb-8">
                    <Building2 className="h-8 w-8 text-yellow-500 mr-4" />
                    <h2 className="text-2xl font-bold text-white">{t.register.title}</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Registration Date</label>
                        <input
                            type="text"
                            value={new Date().toLocaleDateString()}
                            disabled
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-slate-500 cursor-not-allowed"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">{t.register.labels.legal_name}</label>
                            <input
                                type="text"
                                name="legalName"
                                value={formData.legalName}
                                onChange={handleInputChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
                                placeholder={t.register.placeholders.legal_name}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">{t.register.labels.trade_name}</label>
                            <input
                                type="text"
                                name="tradeName"
                                value={formData.tradeName}
                                onChange={handleInputChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
                                placeholder={t.register.placeholders.trade_name}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">{t.register.labels.type}</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
                            >
                                <option>Sole Proprietorship</option>
                                <option>Partnership</option>
                                <option>Private Limited</option>
                                <option>Public Limited</option>
                                <option>LLP</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">{t.register.category}</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
                            >
                                <option value="">Select Category</option>
                                <option value="Retail">Retail</option>
                                <option value="Food & Beverage">Food & Beverage</option>
                                <option value="Service">Service</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="IT & Technology">IT & Technology</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Education">Education</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">{t.register.labels.gst}</label>
                            <input
                                type="text"
                                name="gstNumber"
                                value={formData.gstNumber}
                                onChange={handleInputChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
                                placeholder={t.register.placeholders.gst}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">{t.register.proof_address}</label>
                            <div className="border border-slate-800 rounded-lg px-4 py-2 bg-slate-950 flex items-center">
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => {
                                        // In a real app, upload to server/S3 and get URL
                                        // For demo, we'll just store the filename
                                        const file = e.target.files ? e.target.files[0] : null;
                                        if (file) {
                                            setFormData(prev => ({ ...prev, proofOfAddress: file.name }));
                                        }
                                    }}
                                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-slate-900 hover:file:bg-yellow-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">{t.register.labels.logo}</label>
                        <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-yellow-500 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setLogoFile(e.target.files ? e.target.files[0] : null)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className="h-10 w-10 text-slate-500 mx-auto mb-2" />
                            <p className="text-slate-400">{logoFile ? logoFile.name : t.register.labels.upload_logo}</p>
                            <p className="text-xs text-slate-600 mt-1">Supports JPG, PNG</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">{t.register.labels.address}</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
                            placeholder={t.register.placeholders.address}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">{t.register.labels.branch}</label>
                            <input
                                type="text"
                                name="branchName"
                                value={formData.branchName}
                                onChange={handleInputChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
                                placeholder={t.register.placeholders.branch}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">{t.register.labels.contact}</label>
                            <input
                                type="text"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                        <button
                            onClick={saveDraft}
                            className="text-slate-400 hover:text-white flex items-center transition-colors"
                        >
                            <Save className="h-5 w-5 mr-2" />
                            {t.register.labels.save_draft}
                        </button>
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !formData.legalName || !formData.tradeName}
                            className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold px-8 py-3 rounded-lg transition-all flex items-center"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Shield className="h-5 w-5 mr-2" />
                                    {t.register.labels.verify_proceed}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {analysisResult && (
                    <div className={`mt-8 p-6 rounded-xl border ${analysisResult.isSafe ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                        <div className="flex items-start">
                            {analysisResult.isSafe ? (
                                <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-4" />
                            ) : (
                                <AlertTriangle className="h-6 w-6 text-red-500 mt-1 mr-4" />
                            )}
                            <div className="flex-1">
                                <h3 className={`text-lg font-bold mb-2 ${analysisResult.isSafe ? 'text-green-400' : 'text-red-400'}`}>
                                    {analysisResult.isSafe ? 'Verification Successful' : 'Risk Detected'}
                                </h3>
                                <p className="text-slate-300 mb-4">{analysisResult.message}</p>

                                {analysisResult.isSafe && (
                                    <div className="mt-6 pt-6 border-t border-slate-700/50">
                                        <div className="mb-6">
                                            <div className="flex items-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    id="terms"
                                                    checked={termsAccepted}
                                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-yellow-500 focus:ring-yellow-500"
                                                />
                                                <label htmlFor="terms" className="ml-2 text-sm text-slate-300">
                                                    I agree to the <button onClick={() => setShowTerms(!showTerms)} className="text-yellow-500 hover:underline">Terms and Conditions</button>
                                                </label>
                                            </div>
                                            {showTerms && (
                                                <div className="bg-slate-950 p-4 rounded-lg text-xs text-slate-400 mb-2">
                                                    <p>1. I hereby declare that the information provided is true and correct.</p>
                                                    <p>2. I understand that falsification of data is a punishable offense.</p>
                                                    <p>3. I agree to the digital verification process.</p>
                                                </div>
                                            )}
                                            {termsError && (
                                                <p className="text-red-500 text-sm flex items-center mt-1">
                                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                                    Please agree to the Terms and Conditions to proceed.
                                                </p>
                                            )}
                                        </div>

                                        <div className="bg-slate-950 rounded-lg p-4 mb-6">
                                            <div className="flex justify-between text-sm text-slate-400 mb-2">
                                                <span>Registration Fee</span>
                                                <span>₹500.00</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-slate-400 mb-2">
                                                <span>Blockchain Ledger Fee</span>
                                                <span>₹50.00</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-slate-400 mb-2">
                                                <span>GST (18%)</span>
                                                <span>₹99.00</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-slate-800">
                                                <span>Total Payable</span>
                                                <span>₹649.00</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={initiatePayment}
                                            disabled={isPaymentProcessing}
                                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center"
                                        >
                                            {isPaymentProcessing ? (
                                                <>
                                                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                                                    Processing Payment...
                                                </>
                                            ) : (
                                                'Proceed to Payment'
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
