import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function summarizeContent(content: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the following web content concisely for a browser assistant dashboard: \n\n${content}`,
    });
    return response.text || '';
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function getAIInsights(context: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the following browsing history and context, provide 3 key insights or opportunities (threat detection, productivity tips, or related search suggestions). Keep each brief and actionable. \n\n${context}`,
    });
    return response.text || '';
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
