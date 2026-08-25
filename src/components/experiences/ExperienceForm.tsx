"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { ChipInput } from "@/components/ui/ChipInput";
import { EXPERIENCE_CATEGORIES, type ExperienceCategory, type ExperienceInput } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ExperienceFormProps {
  initialValue?: Partial<ExperienceInput>;
  submitLabel?: string;
  onSubmit: (input: ExperienceInput) => Promise<void>;
  onCancel?: () => void;
}

const KEYWORD_SUGGESTIONS = [
  "협업",
  "소통",
  "문제해결",
  "리더십",
  "책임감",
  "주도성",
  "분석력",
  "성실함",
];

const EMPTY: ExperienceInput = {
  category: "project",
  title: "",
  organization: "",
  startDate: "",
  endDate: "",
  techStack: [],
  situation: "",
  task: "",
  action: "",
  result: "",
  keywords: [],
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-sm font-medium text-ink">
        {label}
        {required && <span className="text-seal">*</span>}
      </span>
      {children}
    </label>
  );
}

export function ExperienceForm({
  initialValue,
  submitLabel = "저장",
  onSubmit,
  onCancel,
}: ExperienceFormProps) {
  const [value, setValue] = useState<ExperienceInput>({ ...EMPTY, ...initialValue });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof ExperienceInput>(key: K, v: ExperienceInput[K]) =>
    setValue((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!value.title.trim()) return setError("제목을 입력해주세요.");
    if (!value.situation.trim() || !value.task.trim() || !value.action.trim() || !value.result.trim()) {
      return setError("S/T/A/R 항목은 모두 필수입니다.");
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(value);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4">
        <Field label="카테고리" required>
          <select
            value={value.category}
            onChange={(e) => set("category", e.target.value as ExperienceCategory)}
            className={cn(
              "w-full rounded-input border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-[1.5px] focus:border-seal",
            )}
          >
            {EXPERIENCE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.koLabel} ({c.label})
              </option>
            ))}
          </select>
        </Field>

        <Field label="제목" required>
          <Input
            value={value.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="예: 실시간 채팅 서비스 개발"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="소속/기관">
            <Input
              value={value.organization}
              onChange={(e) => set("organization", e.target.value)}
              placeholder="예: OO대학교 캡스톤"
            />
          </Field>
          <Field label="기간">
            <div className="flex items-center gap-2">
              <Input
                value={value.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                placeholder="2025-03"
              />
              <span className="text-fog">~</span>
              <Input
                value={value.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                placeholder="2025-08"
              />
            </div>
          </Field>
        </div>

        <Field label="사용 기술/툴">
          <ChipInput
            values={value.techStack}
            onChange={(v) => set("techStack", v)}
            placeholder="기술명을 입력하고 Enter (예: React)"
          />
        </Field>
      </section>

      <section className="space-y-4 border-t border-line pt-6">
        <h3 className="text-sm font-medium text-fog">STAR</h3>
        <Field label="S — Situation (상황)" required>
          <Textarea
            rows={3}
            value={value.situation}
            onChange={(e) => set("situation", e.target.value)}
            placeholder="어떤 배경/문제 상황이었는지"
          />
        </Field>
        <Field label="T — Task (과제)" required>
          <Textarea
            rows={3}
            value={value.task}
            onChange={(e) => set("task", e.target.value)}
            placeholder="본인에게 주어진 역할/목표"
          />
        </Field>
        <Field label="A — Action (행동)" required>
          <Textarea
            rows={4}
            value={value.action}
            onChange={(e) => set("action", e.target.value)}
            placeholder="구체적으로 무엇을 했는지"
          />
        </Field>
        <Field label="R — Result (결과)" required>
          <Textarea
            rows={3}
            value={value.result}
            onChange={(e) => set("result", e.target.value)}
            placeholder="정량/정성적 성과"
          />
        </Field>
      </section>

      <section className="border-t border-line pt-6">
        <Field label="키워드">
          <ChipInput
            values={value.keywords}
            onChange={(v) => set("keywords", v)}
            placeholder="이 경험을 대표하는 역량 키워드 입력 후 Enter"
            suggestions={KEYWORD_SUGGESTIONS}
          />
        </Field>
      </section>

      {error && <p className="text-sm text-warn">{error}</p>}

      <div className="flex items-center gap-2 border-t border-line pt-6">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "저장 중..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            취소
          </Button>
        )}
      </div>
    </form>
  );
}
