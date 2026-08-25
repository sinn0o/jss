"use client";

import Link from "next/link";
import { useCoverLetters } from "@/hooks/useCoverLetters";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { formatDate } from "@/lib/utils";

export default function CoverLettersPage() {
  const { data, loading } = useCoverLetters();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-h1 text-ink">자소서</h1>
          <p className="mt-1 text-sm text-fog">공고 단위로 생성한 자소서 초안 목록입니다.</p>
        </div>
        <Link href="/cover-letters/new">
          <Button variant="primary">+ 새 자소서 생성</Button>
        </Link>
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-fog">불러오는 중...</p>
        ) : data.length === 0 ? (
          <div className="rounded-card border border-dashed border-line py-16 text-center">
            <p className="text-sm text-fog">아직 생성된 자소서가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.map((cl) => (
              <Link key={cl.id} href={`/cover-letters/${cl.id}`}>
                <Card className="h-full transition-colors hover:border-ink">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-h3 text-ink">
                      {cl.companyName || "무제"} · {cl.jobTitle || "-"}
                    </h3>
                    <span className="font-mono text-label text-fog">{formatDate(cl.updatedAt)}</span>
                  </div>
                  <p className="mt-2 font-mono text-label text-fog">문항 {cl.questions.length}개</p>
                  {cl.extractedKeywords.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {cl.extractedKeywords.slice(0, 5).map((k) => (
                        <Tag key={k}>{k}</Tag>
                      ))}
                    </div>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
