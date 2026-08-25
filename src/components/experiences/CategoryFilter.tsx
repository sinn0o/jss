import { EXPERIENCE_CATEGORIES, type ExperienceCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  value: ExperienceCategory | "all";
  onChange: (value: ExperienceCategory | "all") => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={cn(
          "rounded-input border px-3 py-1.5 font-mono text-label transition-colors",
          value === "all"
            ? "border-ink text-ink"
            : "border-line text-fog hover:text-ink",
        )}
      >
        ALL
      </button>
      {EXPERIENCE_CATEGORIES.map((c) => (
        <button
          key={c.value}
          type="button"
          onClick={() => onChange(c.value)}
          className={cn(
            "rounded-input border px-3 py-1.5 font-mono text-label transition-colors",
            value === c.value
              ? "border-ink text-ink"
              : "border-line text-fog hover:text-ink",
          )}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
