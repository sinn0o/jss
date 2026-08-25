"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";

interface ChipInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  /** 클릭 한 번으로 추가할 수 있는 추천 값 목록 (예: 자주 쓰는 키워드) */
  suggestions?: string[];
}

/** Enter로 태그를 추가하는 chip 입력 (기술스택/키워드 등 수동 입력용) */
export function ChipInput({ values, onChange, placeholder, suggestions }: ChipInputProps) {
  const [draft, setDraft] = useState("");

  const addValue = (value: string) => {
    if (!value || values.includes(value)) return;
    onChange([...values, value]);
  };

  const addChip = () => {
    addValue(draft.trim());
    setDraft("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addChip();
    } else if (e.key === "Backspace" && draft === "" && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div className="space-y-2">
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addChip}
        placeholder={placeholder}
      />
      {suggestions && suggestions.some((s) => !values.includes(s)) && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions
            .filter((s) => !values.includes(s))
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addValue(s)}
                className="inline-flex items-center rounded-input border border-line px-2 py-0.5 font-mono text-label text-fog hover:border-seal hover:text-seal"
              >
                + {s}
              </button>
            ))}
        </div>
      )}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v) => (
            <Tag key={v} className="gap-1">
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((x) => x !== v))}
                className="ml-0.5 text-fog hover:text-ink"
                aria-label={`${v} 제거`}
              >
                <X size={11} />
              </button>
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
}
