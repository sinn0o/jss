"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CoverLetterEditor } from "@/components/cover-letters/CoverLetterEditor";
import { Button } from "@/components/ui/Button";
import { storage } from "@/lib/storage";
import type { CoverLetter } from "@/lib/types";

export default function CoverLetterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null | undefined>(undefined);

  useEffect(() => {
    storage.getCoverLetter(id).then(setCoverLetter);
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("이 자소서를 삭제할까요? 되돌릴 수 없습니다.")) return;
    await storage.deleteCoverLetter(id);
    router.push("/cover-letters");
  };

  if (coverLetter === undefined) {
    return <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-fog">불러오는 중...</div>;
  }

  if (coverLetter === null) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm text-fog">자소서를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-h1 text-ink">
            {coverLetter.companyName} · {coverLetter.jobTitle}
          </h1>
          <p className="mt-1 text-sm text-fog">
            문항 단위/전체 재생성과 직접 편집이 가능합니다.
          </p>
        </div>
        <Button variant="ghost" onClick={handleDelete} className="text-warn hover:text-warn">
          삭제
        </Button>
      </div>
      <div className="mt-8">
        <CoverLetterEditor key={coverLetter.id} initialCoverLetter={coverLetter} />
      </div>
    </div>
  );
}
