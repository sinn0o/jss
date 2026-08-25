"use client";

import { useRouter } from "next/navigation";
import { CoverLetterEditor } from "@/components/cover-letters/CoverLetterEditor";

export default function NewCoverLetterPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-h1 text-ink">자소서 생성</h1>
      <p className="mt-1 text-sm text-fog">
        공고 정보와 문항, 활용할 경험을 입력하고 생성 버튼을 누르면 문항별 초안이 만들어집니다.
      </p>
      <div className="mt-8">
        <CoverLetterEditor onSaved={(id) => router.replace(`/cover-letters/${id}`)} />
      </div>
    </div>
  );
}
