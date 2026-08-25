"use client";

import { useRouter } from "next/navigation";
import { ExperienceForm } from "@/components/experiences/ExperienceForm";
import { useExperiences } from "@/hooks/useExperiences";
import type { ExperienceInput } from "@/lib/types";

export default function NewExperiencePage() {
  const router = useRouter();
  const { create } = useExperiences();

  const handleSubmit = async (input: ExperienceInput) => {
    const created = await create(input);
    router.push(`/experiences/${created.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-h1 text-ink">새 경험 등록</h1>
      <p className="mt-1 text-sm text-fog">
        STAR(상황/과제/행동/결과)를 구체적으로 작성할수록 자소서 품질이 좋아집니다.
      </p>
      <div className="mt-8">
        <ExperienceForm submitLabel="등록" onSubmit={handleSubmit} onCancel={() => router.back()} />
      </div>
    </div>
  );
}
