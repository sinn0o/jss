import { Type } from "@google/genai";
import { z } from "zod";

// ---- 요청 스키마 (프론트 → /api/generate) ----

export const GenerateExperienceSchema = z.object({
  id: z.string(),
  category: z.string(),
  title: z.string(),
  organization: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  techStack: z.array(z.string()),
  situation: z.string(),
  task: z.string(),
  action: z.string(),
  result: z.string(),
  keywords: z.array(z.string()),
});

export const GenerateQuestionSchema = z.object({
  id: z.string(),
  question: z.string().min(1),
  charLimit: z.number().int().positive(),
});

export const GenerateRequestSchema = z.object({
  jobInfo: z.object({
    companyName: z.string().min(1),
    jobTitle: z.string().min(1),
    qualification: z.string(),
    preference: z.string(),
    jobPostingRaw: z.string().optional(),
  }),
  selectedExperiences: z.array(GenerateExperienceSchema).min(1, "경험을 1개 이상 선택해주세요."),
  questions: z.array(GenerateQuestionSchema).min(1, "문항을 1개 이상 추가해주세요."),
  mode: z.enum(["full", "single"]),
  targetQuestionId: z.string().optional(),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;

// ---- Gemini 응답 스키마 (모델 → 서버) ----

export const GeminiAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.string(),
  usedExperienceIds: z.array(z.string()).min(1).max(2),
  charCount: z.number().int().nonnegative(),
});

export const GeminiResponseSchema = z.object({
  extractedKeywords: z.array(z.string()),
  answers: z.array(GeminiAnswerSchema).min(1),
});

export type GeminiResponse = z.infer<typeof GeminiResponseSchema>;

// ---- Gemini structured output용 responseSchema (config.responseSchema) ----

export const GEMINI_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    extractedKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    answers: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          questionId: { type: Type.STRING },
          answer: { type: Type.STRING },
          usedExperienceIds: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          charCount: { type: Type.INTEGER },
        },
        required: ["questionId", "answer", "usedExperienceIds", "charCount"],
      },
    },
  },
  required: ["extractedKeywords", "answers"],
};

// ---- API 응답(성공/실패) 공통 타입 ----

export type GenerateApiResponse =
  | { extractedKeywords: string[]; answers: GeminiResponse["answers"] }
  | { error: string; code: "VALIDATION_ERROR" | "NO_API_KEY" | "GEMINI_ERROR" | "INVALID_RESPONSE" };
