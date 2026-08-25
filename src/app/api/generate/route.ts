import { NextResponse } from "next/server";
import { buildPrompt } from "@/lib/gemini/prompt";
import { callGemini } from "@/lib/gemini/client";
import { GenerateRequestSchema, GeminiResponseSchema, type GenerateApiResponse } from "@/lib/gemini/schema";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json<GenerateApiResponse>(
      { error: "요청 본문을 읽을 수 없습니다.", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  const parsedRequest = GenerateRequestSchema.safeParse(json);
  if (!parsedRequest.success) {
    return NextResponse.json<GenerateApiResponse>(
      { error: parsedRequest.error.issues[0]?.message ?? "입력값을 확인해주세요.", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  const body = parsedRequest.data;

  if (body.mode === "single" && !body.targetQuestionId) {
    return NextResponse.json<GenerateApiResponse>(
      { error: "재생성할 문항을 지정해주세요.", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  const targetQuestions =
    body.mode === "single"
      ? body.questions.filter((q) => q.id === body.targetQuestionId)
      : body.questions;

  if (targetQuestions.length === 0) {
    return NextResponse.json<GenerateApiResponse>(
      { error: "대상 문항을 찾을 수 없습니다.", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  const prompt = buildPrompt({ ...body, questions: targetQuestions });

  let raw: string;
  try {
    raw = await callGemini(prompt);
  } catch (err) {
    if (err instanceof Error && err.message === "NO_API_KEY") {
      return NextResponse.json<GenerateApiResponse>(
        {
          error: "GEMINI_API_KEY가 설정되지 않았습니다. 프로젝트 루트의 .env.local 파일에 키를 추가한 뒤 서버를 재시작해주세요.",
          code: "NO_API_KEY",
        },
        { status: 500 },
      );
    }
    console.error("[generate] Gemini 호출 실패:", err);
    return NextResponse.json<GenerateApiResponse>(
      { error: "AI 호출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", code: "GEMINI_ERROR" },
      { status: 500 },
    );
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    console.error("[generate] JSON 파싱 실패. raw:", raw);
    return NextResponse.json<GenerateApiResponse>(
      { error: "AI 응답을 해석하지 못했습니다. 다시 시도해주세요.", code: "INVALID_RESPONSE" },
      { status: 502 },
    );
  }

  const parsedResponse = GeminiResponseSchema.safeParse(parsedJson);
  if (!parsedResponse.success) {
    console.error("[generate] 응답 스키마 검증 실패:", parsedResponse.error, "raw:", raw);
    return NextResponse.json<GenerateApiResponse>(
      { error: "AI 응답 형식이 올바르지 않습니다. 다시 시도해주세요.", code: "INVALID_RESPONSE" },
      { status: 502 },
    );
  }

  // 신뢰성을 위해 charCount는 모델이 준 값 대신 서버에서 재계산한다.
  const answers = parsedResponse.data.answers.map((a) => ({ ...a, charCount: a.answer.length }));

  return NextResponse.json<GenerateApiResponse>({
    extractedKeywords: parsedResponse.data.extractedKeywords,
    answers,
  });
}
