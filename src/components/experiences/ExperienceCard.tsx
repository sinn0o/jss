import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { CategoryLabel } from "@/components/experiences/CategoryLabel";
import { formatPeriod } from "@/lib/utils";
import type { Experience } from "@/lib/types";

export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <Link href={`/experiences/${experience.id}`}>
      <Card className="h-full transition-colors hover:border-ink">
        <div className="flex items-start justify-between gap-2">
          <CategoryLabel category={experience.category} />
          <span className="font-mono text-label text-fog">
            {formatPeriod(experience.startDate, experience.endDate)}
          </span>
        </div>
        <h3 className="mt-2 text-h3 text-ink">{experience.title}</h3>
        {experience.organization && (
          <p className="mt-0.5 text-sm text-fog">{experience.organization}</p>
        )}
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink/80">
          {experience.situation}
        </p>
        {experience.techStack.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {experience.techStack.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
      </Card>
    </Link>
  );
}
