"use client";

import { useEffect, useRef, useState } from "react";
import { useExperiences } from "@/hooks/useExperiences";
import { storage } from "@/lib/storage";
import type { CoverLetter, CoverLetterInput } from "@/lib/types";
import { JobPostingForm, type JobInfoValue } from "./JobPostingForm";
import { QuestionListEditor, type EditableQuestion } from "./QuestionListEditor";
import { ExperienceSelector } from "./ExperienceSelector";
import { GenerateButton } from "./GenerateButton";
import { AnswerResultCard, type AnswerResultQuestion } from "./AnswerResultCard";

type EditorQuestion = AnswerResultQuestion;

// 실제로는 Gemini 호출 한 번으로 키워드 추출과 답안 작성이 함께 처리되지만,
// 사용자에게는 진행 단계처럼 보이도록 문구를 순차 전환한다.
const LOADING_STEPS: { message: string; after: number }[] = [
  { message: "키워드를 추출하는 중이에요...", after: 0 },
  { message: "자소서를 작성하고 있어요...", after: 2500 },
];

function toStoredQuestion(q: EditorQuestion): CoverLetterInput["questions"][number] {
  return {
    id: q.id,
    question: q.question,
    charLimit: q.charLimit,
    generatedAnswer: q.generatedAnswer,
    usedExperienceIds: q.usedExperienceIds,
    charCount: q.charCount,
  };
}

interface CoverLetterEditorProps {
  initialCoverLetter?: CoverLetter;
  onSaved?: (id: string) => void;
}

const EMPTY_JOB_INFO: JobInfoValue = {
  companyName: "",
  jobTitle: "",
  qualification: "",
  preference: "",
  jobPostingRaw: "",
};

function fromCoverLetter(cl?: CoverLetter) {
  if (!cl) {
    return {
      jobInfo: EMPTY_JOB_INFO,
      questions: [] as EditorQuestion[],
      selectedExperienceIds: [] as string[],
      extractedKeywords: [] as string[],
    };
  }
  return {
    jobInfo: {
      companyName: cl.companyName,
      jobTitle: cl.jobTitle,
      qualification: cl.qualification,
      preference: cl.preference,
      jobPostingRaw: cl.jobPostingRaw ?? "",
    },
    questions: cl.questions.map((q) => ({ ...q, resultVersion: 0 })) as EditorQuestion[],
    selectedExperienceIds: cl.selectedExperienceIds,
    extractedKeywords: cl.extractedKeywords,
  };
}

export function CoverLetterEditor({ initialCoverLetter, onSaved }: CoverLetterEditorProps) {
  const { data: experiences } = useExperiences();
  const initial = fromCoverLetter(initialCoverLetter);

  const [jobInfo, setJobInfo] = useState<JobInfoValue>(initial.jobInfo);
  const [questions, setQuestions] = useState<EditorQuestion[]>(initial.questions);
  const [selectedExperienceIds, setSelectedExperienceIds] = useState<string[]>(
    initial.selectedExperienceIds,
  );
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>(initial.extractedKeywords);
  const [savedId, setSavedId] = useState<string | null>(initialCoverLetter?.id ?? null);
  const [generatingScope, setGeneratingScope] = useState<"all" | string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>(LOADING_STEPS[0].message);
  const loadingTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const buildInput = (): CoverLetterInput => ({
    companyName: jobInfo.companyName,
    jobTitle: jobInfo.jobTitle,
    qualification: jobInfo.qualification,
    preference: jobInfo.preference,
    jobPostingRaw: jobInfo.jobPostingRaw || undefined,
    extractedKeywords,
    selectedExperienceIds,
    questions: questions.map(toStoredQuestion),
  });

  // 결과 텍스트 직접 편집 시 500ms 디바운스로 저장 (최초 생성/저장 이후에만)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!savedId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      storage.updateCoverLetter(savedId, buildInput());
    }, 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, jobInfo, selectedExperienceIds, savedId]);

  // 언마운트 시 진행 중인 로딩 문구 전환 타이머 정리
  useEffect(() => {
    return () => {
      loadingTimers.current.forEach(clearTimeout);
    };
  }, []);

  const handleQuestionsChange = (next: EditableQuestion[]) => {
    setQuestions((prev) =>
      next.map((q) => {
        const existing = prev.find((p) => p.id === q.id);
        return existing
          ? { ...existing, question: q.question, charLimit: q.charLimit }
          : {
              ...q,
              generatedAnswer: "",
              usedExperienceIds: [],
              charCount: 0,
              resultVersion: 0,
            };
      }),
    );
  };

  const toggleExperience = (id: string) => {
    setSelectedExperienceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleChangeAnswer = (id: string, text: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, generatedAnswer: text, charCount: text.length } : q)),
    );
  };

  const validate = (): string | null => {
    if (!jobInfo.companyName.trim() || !jobInfo.jobTitle.trim()) {
      return "회사명과 직무명을 입력해주세요.";
    }
    if (questions.length === 0) {
      return "문항을 1개 이상 추가해주세요.";
    }
    if (questions.some((q) => !q.question.trim() || q.charLimit <= 0)) {
      return "모든 문항의 내용과 글자수 제한을 입력해주세요.";
    }
    if (selectedExperienceIds.length === 0) {
      return "활용할 경험을 1개 이상 선택해주세요.";
    }
    return null;
  };

  const runGenerate = async (mode: "full" | "single", targetQuestionId?: string) => {
    const validationError = validate();
    if (validationError) {
      setApiError(validationError);
      return;
    }
    setApiError(null);
    setGeneratingScope(mode === "full" ? "all" : targetQuestionId!);

    // 실제 호출은 한 번이지만, 진행 단계처럼 로딩 문구를 순차적으로 전환한다.
    loadingTimers.current.forEach(clearTimeout);
    loadingTimers.current = LOADING_STEPS.map((step) =>
      setTimeout(() => setLoadingMessage(step.message), step.after),
    );

    try {
      const selected = experiences.filter((e) => selectedExperienceIds.includes(e.id));
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobInfo: {
            companyName: jobInfo.companyName,
            jobTitle: jobInfo.jobTitle,
            qualification: jobInfo.qualification,
            preference: jobInfo.preference,
            jobPostingRaw: jobInfo.jobPostingRaw || undefined,
          },
          selectedExperiences: selected,
          questions: questions.map((q) => ({ id: q.id, question: q.question, charLimit: q.charLimit })),
          mode,
          targetQuestionId,
        }),
      });

      const data = await res.json();
      if (!res.ok || "error" in data) {
        setApiError(data.error ?? "생성 중 오류가 발생했습니다.");
        return;
      }

      let nextQuestions: EditorQuestion[] = [];
      setQuestions((prev) => {
        nextQuestions = prev.map((q) => {
          const answer = data.answers.find((a: { questionId: string }) => a.questionId === q.id);
          if (!answer) return q;
          return {
            ...q,
            generatedAnswer: answer.answer,
            usedExperienceIds: answer.usedExperienceIds,
            charCount: answer.charCount,
            resultVersion: q.resultVersion + 1,
          };
        });
        return nextQuestions;
      });
      setExtractedKeywords(data.extractedKeywords ?? []);

      // 저장 (최초 생성 시 create, 이후에는 update)
      const inputBase: CoverLetterInput = {
        companyName: jobInfo.companyName,
        jobTitle: jobInfo.jobTitle,
        qualification: jobInfo.qualification,
        preference: jobInfo.preference,
        jobPostingRaw: jobInfo.jobPostingRaw || undefined,
        extractedKeywords: data.extractedKeywords ?? [],
        selectedExperienceIds,
        questions: nextQuestions.map(toStoredQuestion),
      };
      if (savedId) {
        await storage.updateCoverLetter(savedId, inputBase);
      } else {
        const created = await storage.createCoverLetter(inputBase);
        setSavedId(created.id);
        onSaved?.(created.id);
      }
    } catch {
      setApiError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      loadingTimers.current.forEach(clearTimeout);
      loadingTimers.current = [];
      setLoadingMessage(LOADING_STEPS[0].message);
      setGeneratingScope(null);
    }
  };

  const generatingSet =
    generatingScope === "all"
      ? new Set(questions.map((q) => q.id))
      : generatingScope
        ? new Set([generatingScope])
        : new Set<string>();

  const hasAnyResult = questions.some((q) => q.generatedAnswer.length > 0);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-8">
        <JobPostingForm value={jobInfo} onChange={setJobInfo} />
        <QuestionListEditor questions={questions} onChange={handleQuestionsChange} />
        <ExperienceSelector
          experiences={experiences}
          selectedIds={selectedExperienceIds}
          onToggle={toggleExperience}
          onSelectAll={setSelectedExperienceIds}
        />

        {extractedKeywords.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-line pt-4">
            <span className="font-mono text-label text-fog">추출된 키워드:</span>
            {extractedKeywords.map((k) => (
              <span key={k} className="font-mono text-label text-ink">
                #{k}
              </span>
            ))}
          </div>
        )}

        {apiError && <p className="text-sm text-warn">{apiError}</p>}

        <GenerateButton
          onClick={() => runGenerate("full")}
          loading={generatingScope !== null}
          loadingMessage={loadingMessage}
          hasResult={hasAnyResult}
        />
      </div>

      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-card border border-dashed border-line text-sm text-fog">
            좌측에서 문항을 추가하고 생성을 눌러보세요.
          </div>
        ) : (
          questions.map((q, i) => (
            <AnswerResultCard
              key={q.id}
              index={i}
              question={q}
              experiences={experiences}
              generating={generatingSet.has(q.id)}
              generatingMessage={loadingMessage}
              onChangeAnswer={(text) => handleChangeAnswer(q.id, text)}
              onRegenerate={() => runGenerate("single", q.id)}
              regenerateDisabled={generatingScope !== null}
            />
          ))
        )}
      </div>
    </div>
  );
}
