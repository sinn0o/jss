import { GoogleGenAI } from "@google/genai";
import { GEMINI_RESPONSE_SCHEMA } from "./schema";

const DEFAULT_MODEL = "gemini-3.6-flash";

export async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  const result = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: GEMINI_RESPONSE_SCHEMA,
      temperature: 0.7,
    },
  });

  const text = result.text;
  if (!text) {
    throw new Error("EMPTY_RESPONSE");
  }
  return text;
}
