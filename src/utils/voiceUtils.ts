/**
 * TN-MBNR Voice Utility
 * Provides Text-to-Speech (TTS) capabilities for Tamil and English.
 */

export const speakTamil = (text: string) => {
    if (!('speechSynthesis' in window)) {
        console.warn("Speech Synthesis not supported");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Try to find a Tamil voice
    const voices = window.speechSynthesis.getVoices();
    const tamilVoice = voices.find(v => v.lang.startsWith('ta'));

    if (tamilVoice) {
        utterance.voice = tamilVoice;
    } else {
        // Fallback to English but try to speak clearly
        utterance.lang = 'ta-IN';
    }

    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
};

export const announceStatus = (status: 'VALID' | 'INVALID' | 'LOCATION_MISMATCH' | 'EXPIRED' | 'COUNTERFEIT', businessName?: string) => {
    let message = "";

    switch (status) {
        case 'VALID':
            message = `உறுதிப்படுத்தப்பட்டது. இது ${businessName || 'இந்த கடை'} உண்மையானது.`;
            // En: "Verified. This shop is genuine."
            break;
        case 'LOCATION_MISMATCH':
            message = `எச்சரிக்கை! இடம் பொருந்தவில்லை. இது திருடப்பட்ட குறியீடு ஆகும்.`;
            // En: "Warning! Location mismatch. This is a stolen code."
            break;
        case 'EXPIRED':
            message = `இந்த குறியீடு காலாவதியானது. புதிய குறியீட்டை கேட்கவும்.`;
            // En: "This code is expired. Ask for a new code."
            break;
        case 'COUNTERFEIT':
        case 'INVALID':
            message = `எச்சரிக்கை! இது போலியான குறியீடு. பணத்தை செலுத்த வேண்டாம்.`;
            // En: "Warning! This is a fake code. Do not pay money."
            break;
    }

    speakTamil(message);
};
