import { GoogleGenAI } from "@google/genai";
import { AiTone } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const polishText = async (text: string, tone: AiTone): Promise<string> => {
  if (!text.trim()) return "";

  try {
    const model = "gemini-2.5-flash";
    const prompt = `Rewrite the following text to be ${tone}. Maintain the original meaning but improve clarity and style appropriate for the requested tone.
    
    Text: "${text}"`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Could not generate text.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to process text with AI.");
  }
};

export const summarizeText = async (text: string): Promise<string> => {
  if (!text.trim()) return "";
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Summarize the following text into a concise paragraph:\n\n"${text}"`,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to summarize text.");
  }
};