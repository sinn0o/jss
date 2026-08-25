"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useExperiences } from "@/hooks/useExperiences";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { CategoryFilter } from "@/components/experiences/CategoryFilter";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ExperienceCategory } from "@/lib/types";

export default function ExperiencesPage() {
  const { data, loading } = useExperiences();
  const [category, setCategory] = useState<ExperienceCategory | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((e) => {
      if (category !== "all" && e.category !== category) return false;
      if (!q) return true;
      const haystack = [e.title, ...e.keywords, ...e.techStack].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [data, category, query]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-h1 text-ink">경험</h1>
          <p className="mt-1 text-sm text-fog">
            STAR 형식으로 정리한 경험은 자소서 생성 시 재료로 활용됩니다.
          </p>
        </div>
        <Link href="/experiences/new">
          <Button variant="primary">+ 새 경험</Button>
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter value={category} onChange={setCategory} />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="제목/키워드/기술 검색"
          className="sm:w-64"
        />
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-fog">불러오는 중...</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-card border border-dashed border-line py-16 text-center">
            <p className="text-sm text-fog">
              {data.length === 0
                ? "아직 등록된 경험이 없습니다. 첫 경험을 등록해보세요."
                : "조건에 맞는 경험이 없습니다."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <ExperienceCard key={e.id} experience={e} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
