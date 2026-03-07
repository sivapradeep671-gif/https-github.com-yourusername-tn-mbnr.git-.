import React from 'react';
import { AlertTriangle, Camera, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CitizenReportProps {
    onReport: (report: any) => void;
    prefillName?: string;
}

export const CitizenReport: React.FC<CitizenReportProps> = ({ onReport, prefillName }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = React.useState({
        name: prefillName || '',
        location: '',
        description: '',
        category: 'Fraudulent QR',
        severity: 'Medium'
    });
    const [image, setImage] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = React.useState(false);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (prefillName) {
            setFormData(prev => ({ ...prev, name: prefillName }));
        }
        return () => {
            stopCamera();
        };
    }, [prefillName]);

    const startCamera = async () => {
        try {
            setIsCameraOpen(true);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please allow permissions or use file upload.");
            setIsCameraOpen(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "captured_photo.jpg", { type: "image/jpeg" });
                        setImage(file);
                        setPreviewUrl(URL.createObjectURL(file));
                        stopCamera();
                    }
                }, 'image/jpeg');
            }
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append('businessName', formData.name);
        data.append('location', formData.location);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('severity', formData.severity);
        if (image) {
            data.append('image', image);
        }

        onReport(data);
    };

    const categories = [
        { value: 'Fraudulent QR', label: t.report.categories.options.fraud_qr },
        { value: 'Price Gouging', label: t.report.categories.options.price_gouging },
        { value: 'Improper Weight', label: t.report.categories.options.improper_weight },
        { value: 'Counterfeit Goods', label: t.report.categories.options.counterfeit },
        { value: 'Poor Hygiene', label: t.report.categories.options.hygiene },
        { value: 'Other', label: t.report.categories.options.other }
    ];

    const severities = [
        { value: 'Low', label: t.report.severity.options.low },
        { value: 'Medium', label: t.report.severity.options.medium },
        { value: 'High', label: t.report.severity.options.high },
        { value: 'Urgent', label: t.report.severity.options.urgent }
    ];

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                    <AlertTriangle className="h-32 w-32 text-red-500" />
                </div>

                <div className="flex items-center mb-10 relative z-10">
                    <div className="h-12 w-12 bg-red-500/10 rounded-xl flex items-center justify-center mr-4 border border-red-500/20">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{t.report.title}</h2>
                        <p className="text-slate-500 text-sm mt-1">{t.report.subtitle}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">{t.report.labels.name}</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all outline-none placeholder-slate-700"
                                placeholder={t.report.placeholders.name}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">{t.report.categories.label}</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all outline-none appearance-none cursor-pointer"
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">{t.report.severity.label}</label>
                        <div className="grid grid-cols-4 gap-3">
                            {severities.map(sev => (
                                <button
                                    key={sev.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, severity: sev.value }))}
                                    className={`py-3 rounded-xl text-xs font-bold transition-all border ${formData.severity === sev.value
                                        ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20'
                                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                                        }`}
                                >
                                    {sev.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">{t.report.labels.location}</label>
                        <textarea
                            rows={3}
                            required
                            value={formData.location}
                            onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all outline-none placeholder-slate-700"
                            placeholder={t.report.placeholders.location}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Camera Logic */}
                        <div className="relative w-full aspect-video bg-slate-950 border-2 border-dashed border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors group">
                            {isCameraOpen ? (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-20">
                                        <button
                                            type="button"
                                            onClick={capturePhoto}
                                            className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold shadow-lg hover:bg-slate-200 transition-all flex items-center gap-2"
                                        >
                                            <Camera className="h-4 w-4" /> {t.report.camera.capture}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={stopCamera}
                                            className="bg-slate-900/80 text-white px-4 py-2 rounded-full text-sm hover:bg-slate-900 transition-all"
                                        >
                                            {t.report.camera.cancel}
                                        </button>
                                    </div>
                                </>
                            ) : previewUrl ? (
                                <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer h-full w-full relative group">
                                    <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all">
                                        <p className="text-white font-bold flex items-center gap-2"><Camera className="h-5 w-5" /> {t.report.camera.change}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); startCamera(); }}
                                        className="absolute bottom-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-500 z-20"
                                        title="Retake with Camera"
                                    >
                                        <Camera className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={startCamera}
                                            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
                                        >
                                            <Camera className="h-5 w-5" /> {t.report.camera.live}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-all"
                                        >
                                            {t.report.camera.upload}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-600 font-medium tracking-wide">{t.report.camera.take_photo}</p>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-red-600/20 md:h-full h-auto"
                        >
                            {t.report.submit}
                        </button>
                    </div>

                    <div className="mt-8 flex items-start gap-3 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                        <Shield className="h-5 w-5 text-slate-600 shrink-0" />
                        <p className="text-[10px] text-slate-500 leading-relaxed italic">
                            <strong>Blockchain Verification:</strong> {t.report.disclaimer}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
