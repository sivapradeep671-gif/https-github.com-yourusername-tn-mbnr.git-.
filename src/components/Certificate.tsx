import React, { useRef } from 'react';
import { Shield, Printer, X, CheckCircle, MapPin, Calendar } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface CertificateProps {
    business: {
        id: string;
        tradeName: string;
        legalName: string;
        address: string;
        registrationDate: string;
        category: string;
    };
    onClose: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({ business, onClose }) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm overflow-y-auto">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Controls - Hidden on print */}
                <div className="absolute top-4 right-4 flex space-x-2 z-10 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors shadow-lg"
                        title="Print Certificate"
                    >
                        <Printer className="h-5 w-5" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-full transition-colors shadow-lg"
                        title="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Left Side: Branding & Official Look */}
                <div className="hidden md:flex md:w-1/3 bg-slate-900 p-8 text-white flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-blue-500 rounded-full blur-[100px]" />
                        <div className="absolute bottom-[-20%] right-[-20%] w-[100%] h-[100%] bg-yellow-500 rounded-full blur-[100px]" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-8">
                            <Shield className="h-10 w-10 text-yellow-500" />
                            <div>
                                <h2 className="text-xl font-bold tracking-tight">TN-MBNR</h2>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">TrustReg TN Pilot</p>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold leading-tight mb-4">Official Verification Certificate</h1>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Issued by the Municipal Administration, Govt. of Tamil Nadu for business authenticity verification.
                        </p>
                    </div>

                    <div className="relative z-10 pt-12">
                        <div className="p-4 bg-white rounded-xl shadow-xl inline-block">
                            <QRCodeSVG
                                value={business.id}
                                size={120}
                                level="H"
                                includeMargin={true}
                                imageSettings={{
                                    src: "/shield-icon.png",
                                    x: undefined,
                                    y: undefined,
                                    height: 24,
                                    width: 24,
                                    excavate: true,
                                }}
                            />
                        </div>
                        <p className="mt-4 text-[10px] text-slate-500 font-mono text-center w-[120px]">
                            {business.id}
                        </p>
                    </div>

                    <div className="relative z-10 text-[10px] text-slate-500 font-mono mt-auto">
                        GENERATED: {new Date().toLocaleString()}
                    </div>
                </div>

                {/* Right Side: Details - This is the main design */}
                <div ref={printRef} className="flex-1 bg-white p-12 text-slate-900 print:p-0">
                    <div className="border-[12px] border-double border-slate-100 p-8 h-full flex flex-col relative">
                        {/* Decorative Corner */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -mr-4 -mt-4" />

                        <div className="text-center mb-12">
                            <div className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold mb-4 flex items-center justify-center">
                                <CheckCircle className="h-3 w-3 mr-1" /> VALID & VERIFIED
                            </div>
                            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">Registration License</h2>
                            <p className="text-slate-500 text-sm font-light">Municipal Business Name Registry Program</p>
                        </div>

                        <div className="space-y-8 flex-1">
                            <section>
                                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">Business Name</label>
                                <h3 className="text-2xl font-bold text-slate-800">{business.tradeName}</h3>
                                <p className="text-slate-500 text-xs italic">Listed as: {business.legalName}</p>
                            </section>

                            <div className="grid grid-cols-2 gap-8">
                                <section>
                                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">Status</label>
                                    <p className="font-bold text-green-600 flex items-center">
                                        <CheckCircle className="h-4 w-4 mr-2" /> Active Pilot Member
                                    </p>
                                </section>
                                <section>
                                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">Category</label>
                                    <p className="font-bold text-slate-800">{business.category}</p>
                                </section>
                            </div>

                            <section>
                                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">Registered Address</label>
                                <div className="flex items-start">
                                    <MapPin className="h-4 w-4 text-slate-400 mr-2 mt-0.5" />
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                        {business.address}
                                    </p>
                                </div>
                            </section>

                            <section>
                                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">Issuance Date</label>
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                                    <p className="text-sm text-slate-800 font-bold">{business.registrationDate}</p>
                                </div>
                            </section>
                        </div>

                        {/* Footer Signatures */}
                        <div className="mt-12 pt-12 border-t border-slate-100 grid grid-cols-2">
                            <div className="text-center">
                                <div className="h-12 flex items-center justify-center italic font-serif text-slate-400 text-2xl">
                                    TrustReg TN
                                </div>
                                <label className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">Digital Signature</label>
                            </div>
                            <div className="text-center">
                                <div className="h-12 flex items-center justify-center font-bold text-slate-800">
                                    {business.id.split('-').pop()}
                                </div>
                                <label className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">Authentication Seal</label>
                            </div>
                        </div>

                        {/* Mobile Only QR (Visible on Print) */}
                        <div className="mt-8 md:hidden flex justify-center print:flex">
                            <QRCodeSVG value={business.id} size={100} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
