import { GoogleGenAI, ThinkingLevel } from "@google/genai";
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
      // 자소서 초안 작성은 깊은 추론이 필요한 작업이 아니라, 기본 추론 깊이로 두면
      // 응답이 불필요하게 느려진다. LOW로 낮춰 속도를 우선한다.
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    },
  });

  const text = result.text;
  if (!text) {
    throw new Error("EMPTY_RESPONSE");
  }
  return text;
}
