import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RefreshCw, Clock, Download } from 'lucide-react';
import { generateMockToken } from '../utils/mockQR';

interface DynamicQRProps {
    businessId: string;
}

export const DynamicQR: React.FC<DynamicQRProps> = ({ businessId }) => {
    const [qrData, setQrData] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(30);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchToken = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/qr-token/${businessId}`);
            if (!response.ok) throw new Error("API Error");
            const data = await response.json();
            if (data.token) {
                setQrData(data.token);
                setTimeLeft(30);
            }
        } catch (error) {
            console.warn("API Failed, using Mock Token (Demo Mode)");
            const mockToken = generateMockToken(businessId);
            setQrData(mockToken);
            setTimeLeft(30);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadQR = () => {
        const svg = document.getElementById("dynamic-qr-code");
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                if (ctx) {
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    const pngFile = canvas.toDataURL("image/png");
                    const downloadLink = document.createElement("a");
                    downloadLink.download = `Shop_QR_${businessId}.png`;
                    downloadLink.href = pngFile;
                    downloadLink.click();
                }
            };
            img.src = "data:image/svg+xml;base64," + btoa(svgData);
        }
    };

    useEffect(() => {
        fetchToken();
        const interval = setInterval(fetchToken, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, [businessId]);

    useEffect(() => {
        if (!qrData) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [qrData]);

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-lg relative overflow-hidden group">
            {/* Animated Border for Security Visual */}
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-blue-500/20 rounded-xl transition-all duration-500"></div>

            <div className="relative mb-4">
                {isLoading ? (
                    <div className="w-48 h-48 flex items-center justify-center bg-slate-100 rounded-lg">
                        <RefreshCw className="h-8 w-8 text-slate-400 animate-spin" />
                    </div>
                ) : (
                    qrData && (
                        <div className="p-2 bg-white rounded-lg border-2 border-slate-100">
                            <QRCodeSVG
                                id="dynamic-qr-code"
                                value={qrData}
                                size={200}
                                level="H"
                                includeMargin={true}
                                className="transition-all duration-300"
                            />
                        </div>
                    )
                )}

                {qrData && !isLoading && (
                    <button
                        onClick={downloadQR}
                        className="mt-4 flex items-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg hover:shadow-blue-500/30 z-10 relative"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Download QR
                    </button>
                )}

                {/* Security Hologram Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none transform -translate-x-full group-hover:translate-x-full" style={{ transitionDuration: '2s' }}></div>
            </div>

            <div className="flex items-center space-x-2 text-sm font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Refreshes in <span className={`font-bold ${timeLeft < 5 ? 'text-red-500' : 'text-slate-700'}`}>{timeLeft}s</span></span>
            </div>

            <p className="mt-2 text-xs text-slate-400 text-center uppercase tracking-wide">
                Secure Dynamic QR • TN-MBNR
            </p>
        </div>
    );
};
