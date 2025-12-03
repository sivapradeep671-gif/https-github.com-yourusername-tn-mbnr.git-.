import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalysisResult } from "../types/types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
}

export const analyzeBusinessLogo = async (
    imageFile: File,
    businessName: string
): Promise<AnalysisResult> => {
    if (!genAI) {
        console.warn("Gemini API Key not found. Falling back to mock analysis.");
        return mockAnalysis(businessName);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      You are an expert in trademark infringement and counterfeit detection.
      Analyze this logo image for a business named "${businessName}".
      
      Check for:
      1. Visual similarity to famous global or local brands (e.g., Starbucks, KFC, A2B, Saravana Bhavan).
      2. Use of copyrighted mascots or symbols.
      3. Deceptive typography meant to mimic another brand.

      Return a JSON object with this structure:
      {
        "isSafe": boolean,
        "riskLevel": "Low" | "Medium" | "High",
        "similarBrands": string[],
        "message": "A brief explanation of the finding."
      }
      
      Only return the JSON.
    `;

        const imageParts = await fileToGenerativePart(imageFile);
        const result = await model.generateContent([prompt, imageParts]);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Gemini Analysis Failed:", error);
        return {
            isSafe: false,
            riskLevel: "Medium",
            message: "AI Analysis failed. Please try again or proceed with manual verification.",
        };
    }
};

async function fileToGenerativePart(file: File) {
    const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: {
            data: await base64EncodedDataPromise as string,
            mimeType: file.type,
        },
    };
}

const mockAnalysis = (name: string): AnalysisResult => {
    const riskyNames = ['starbucks', 'a2b', 'dominos', 'kfc'];
    const isRisky = riskyNames.some(n => name.toLowerCase().includes(n));

    return {
        isSafe: !isRisky,
        riskLevel: isRisky ? 'High' : 'Low',
        similarBrands: isRisky ? ['Famous Brand'] : [],
        message: isRisky ? 'Potential trademark infringement detected (Mock).' : 'Trade name appears safe (Mock).',
    };
};
