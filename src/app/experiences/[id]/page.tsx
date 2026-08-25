"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ExperienceForm } from "@/components/experiences/ExperienceForm";
import { Button } from "@/components/ui/Button";
import { storage } from "@/lib/storage";
import type { Experience, ExperienceInput } from "@/lib/types";

export default function ExperienceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [experience, setExperience] = useState<Experience | null | undefined>(undefined);

  useEffect(() => {
    storage.getExperience(id).then(setExperience);
  }, [id]);

  const handleSubmit = async (input: ExperienceInput) => {
    const updated = await storage.updateExperience(id, input);
    setExperience(updated);
  };

  const handleDelete = async () => {
    if (!confirm("이 경험을 삭제할까요? 되돌릴 수 없습니다.")) return;
    await storage.deleteExperience(id);
    router.push("/experiences");
  };

  if (experience === undefined) {
    return <div className="mx-auto max-w-2xl px-6 py-12 text-sm text-fog">불러오는 중...</div>;
  }

  if (experience === null) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <p className="text-sm text-fog">경험을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-h1 text-ink">경험 수정</h1>
        <Button variant="ghost" onClick={handleDelete} className="text-warn hover:text-warn">
          삭제
        </Button>
      </div>
      <div className="mt-8">
        <ExperienceForm
          initialValue={experience}
          submitLabel="저장"
          onSubmit={handleSubmit}
          onCancel={() => router.push("/experiences")}
        />
      </div>
    </div>
  );
}
