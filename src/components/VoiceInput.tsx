import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { showToast } from '../hooks/useToast';
import { useLanguage } from '../context/LanguageContext';

interface VoiceInputProps {
    onResult: (text: string) => void;
    placeholder?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onResult, placeholder }) => {
    const { language } = useLanguage();
    const [isListening, setIsListening] = useState(false);
    const [isSupported] = useState(() => {
        return typeof window !== 'undefined' && 
               (('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window));
    });

    const startListening = () => {
        if (!isSupported) {
            showToast("Voice input is not supported in this browser.", "warning");
            return;
        }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();

        // Dynamically set language based on app context
        recognition.lang = language === 'ta' ? 'ta-IN' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onResult(transcript);
            setIsListening(false);
            showToast(language === 'ta' ? "உரை சேகரிக்கப்பட்டது" : "Speech captured", "success");
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
            showToast(`${language === 'ta' ? 'பேச்சுப் பிழை' : 'Speech error'}: ${event.error}`, "error");
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    if (!isSupported) return null;

    const tooltip = placeholder || (isListening 
        ? (language === 'ta' ? "கவனிக்கிறது..." : "Listening...") 
        : (language === 'ta' ? "குரல் மூலம் தேடு" : "Search by voice"));

    return (
        <button
            onClick={startListening}
            className={`p-2 rounded-xl transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'}`}
            title={tooltip}
        >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
    );
};
