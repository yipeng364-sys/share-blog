
import { GoogleGenAI } from "@google/genai";

// Fix: Always use direct process.env.API_KEY reference
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAssistantResponse = async (userMessage: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: "You are 'Momo-chan', the high-energy, cute, and slightly geeky (otaku) assistant for this personal digital space. You love anime, games, and talking to visitors. Keep responses short, expressive with emojis, and welcoming. If asked about the site, explain that it's a creative sanctuary for its owner.",
        temperature: 0.8,
      },
    });
    // Fix: Access .text property directly (already correct in original, but keeping consistent)
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Momo-chan is currently taking a nap... (Error connecting to AI) 💤";
  }
};