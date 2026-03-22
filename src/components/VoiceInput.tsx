import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { showToast } from '../hooks/useToast';

interface VoiceInputProps {
    onResult: (text: string) => void;
    placeholder?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onResult, placeholder = "Listening..." }) => {
    const [isListening, setIsListening] = useState(false);
    const [isSupported] = useState(() => {
        return typeof window !== 'undefined' && 
               (('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window));
    });

    useEffect(() => {
        // Voice input initialization if needed
    }, []);

    const startListening = () => {
        if (!isSupported) {
            showToast("Voice input is not supported in this browser.", "warning");
            return;
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onResult(transcript);
            setIsListening(false);
            showToast("Speech captured", "success");
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
            showToast(`Speech error: ${event.error}`, "error");
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    if (!isSupported) return null;

    return (
        <button
            onClick={startListening}
            className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            title={placeholder}
        >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
    );
};
