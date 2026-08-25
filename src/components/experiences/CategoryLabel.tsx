import { EXPERIENCE_CATEGORIES, type ExperienceCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryLabel({
  category,
  className,
}: {
  category: ExperienceCategory;
  className?: string;
}) {
  const meta = EXPERIENCE_CATEGORIES.find((c) => c.value === category);
  return (
    <span className={cn("font-mono text-label text-fog tracking-wide", className)}>
      {meta?.label ?? category.toUpperCase()}
    </span>
  );
}
