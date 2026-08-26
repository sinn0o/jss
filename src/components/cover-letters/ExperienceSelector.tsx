import Link from "next/link";
import { CategoryLabel } from "@/components/experiences/CategoryLabel";
import type { Experience } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ExperienceSelectorProps {
  experiences: Experience[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
}

export function ExperienceSelector({
  experiences,
  selectedIds,
  onToggle,
  onSelectAll,
}: ExperienceSelectorProps) {
  const allSelected = experiences.length > 0 && selectedIds.length === experiences.length;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-h3 text-ink">경험 선택</h2>
        <div className="flex items-center gap-2">
          {experiences.length > 0 && (
            <button
              type="button"
              onClick={() => onSelectAll(allSelected ? [] : experiences.map((e) => e.id))}
              className="font-mono text-label text-seal hover:underline"
            >
              {allSelected ? "전체 해제" : "전체 선택"}
            </button>
          )}
          <span className="font-mono text-label text-fog">{selectedIds.length}개 선택됨</span>
        </div>
      </div>

      {experiences.length === 0 ? (
        <p className="rounded-card border border-dashed border-line p-4 text-sm text-fog">
          등록된 경험이 없습니다.{" "}
          <Link href="/experiences/new" className="text-seal hover:underline">
            경험을 먼저 등록
          </Link>
          해주세요.
        </p>
      ) : (
        <div className="max-h-72 space-y-1.5 overflow-y-auto rounded-card border border-line p-2">
          {experiences.map((exp) => {
            const checked = selectedIds.includes(exp.id);
            return (
              <label
                key={exp.id}
                className={cn(
                  "flex cursor-pointer items-start gap-2.5 rounded-input px-2 py-2 transition-colors hover:bg-panel",
                  checked && "bg-seal-light",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(exp.id)}
                  className="mt-0.5 h-4 w-4 accent-seal"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <CategoryLabel category={exp.category} />
                    <span className="truncate text-sm text-ink">{exp.title}</span>
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      )}
    </section>
  );
}
