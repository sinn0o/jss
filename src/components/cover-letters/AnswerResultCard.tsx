"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CharCounter } from "@/components/ui/CharCounter";
import { CompletionStamp } from "@/components/ui/CompletionStamp";
import type { Experience } from "@/lib/types";

export interface AnswerResultQuestion {
  id: string;
  question: string;
  charLimit: number;
  generatedAnswer: string;
  usedExperienceIds: string[];
  charCount: number;
  resultVersion: number; // 완료 스탬프 재생을 위한 카운터 (재생성마다 증가)
}

interface AnswerResultCardProps {
  index: number;
  question: AnswerResultQuestion;
  experiences: Experience[];
  generating: boolean;
  generatingMessage?: string;
  onChangeAnswer: (text: string) => void;
  onRegenerate: () => void;
  regenerateDisabled?: boolean;
}

export function AnswerResultCard({
  index,
  question,
  experiences,
  generating,
  generatingMessage,
  onChangeAnswer,
  onRegenerate,
  regenerateDisabled,
}: AnswerResultCardProps) {
  const [copied, setCopied] = useState(false);
  const hasResult = question.generatedAnswer.length > 0;

  const usedExperiences = question.usedExperienceIds
    .map((id) => experiences.find((e) => e.id === id))
    .filter((e): e is Experience => Boolean(e));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(question.generatedAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard 접근 실패 시 조용히 무시 (권한 문제 등)
    }
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-label text-fog">Q{index + 1}.</span>
            <h3 className="truncate text-sm font-medium text-ink">
              {question.question || "(문항 내용 없음)"}
            </h3>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <CharCounter count={question.charCount} limit={question.charLimit} />
          {hasResult && !generating && <CompletionStamp key={question.resultVersion} />}
        </div>
      </div>

      <div className="mt-4">
        {generating ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-input border border-line text-sm text-fog">
            <span className="font-mono text-label">GENERATING...</span>
            <span>{generatingMessage || "AI가 답안을 작성하고 있습니다 (5~15초 소요)"}</span>
          </div>
        ) : hasResult ? (
          <Textarea
            rows={8}
            value={question.generatedAnswer}
            onChange={(e) => onChangeAnswer(e.target.value)}
          />
        ) : (
          <div className="flex h-32 items-center justify-center rounded-input border border-dashed border-line font-mono text-label text-fog">
            준비중
          </div>
        )}
      </div>

      {hasResult && usedExperiences.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-label text-fog">활용 경험:</span>
          {usedExperiences.map((e) => (
            <Tag key={e.id} variant="seal">
              {e.title}
            </Tag>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onRegenerate}
          disabled={generating || regenerateDisabled}
        >
          {generating ? "생성 중..." : "재생성"}
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleCopy}
          disabled={!hasResult || generating}
        >
          {copied ? "복사됨 ✓" : "복사하기"}
        </Button>
      </div>
    </Card>
  );
}
