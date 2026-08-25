"use client";

import Link from "next/link";
import { useExperiences } from "@/hooks/useExperiences";
import { useCoverLetters } from "@/hooks/useCoverLetters";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const { data: experiences, loading: expLoading } = useExperiences();
  const { data: coverLetters, loading: clLoading } = useCoverLetters();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-label text-seal">초안에 도장을 찍다.</p>
      <h1 className="mt-2 text-h1 text-ink">
        경험을 재료로, 채용공고에 맞춘
        <br />
        자소서 초안을 만듭니다.
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-fog">
        STAR 형식으로 경험을 정리해두면, 공고 정보를 입력했을 때 AI가 가장 적합한 경험을 골라
        문항별 자소서 초안을 생성합니다.
      </p>

      <div className="mt-8 flex gap-3">
        <Link href="/experiences/new">
          <Button variant="secondary">경험 등록하기</Button>
        </Link>
        <Link href="/cover-letters/new">
          <Button variant="primary">자소서 생성하기</Button>
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="font-mono text-label text-fog">EXPERIENCES</p>
          <p className="mt-2 text-h1 text-ink">{expLoading ? "-" : experiences.length}</p>
        </Card>
        <Card>
          <p className="font-mono text-label text-fog">COVER LETTERS</p>
          <p className="mt-2 text-h1 text-ink">{clLoading ? "-" : coverLetters.length}</p>
        </Card>
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-h3 text-ink">최근 자소서</h2>
          <Link href="/cover-letters" className="text-sm text-fog hover:text-ink">
            전체 보기 →
          </Link>
        </div>
        <div className="mt-4">
          {clLoading ? (
            <p className="text-sm text-fog">불러오는 중...</p>
          ) : coverLetters.length === 0 ? (
            <p className="rounded-card border border-dashed border-line p-6 text-center text-sm text-fog">
              아직 생성된 자소서가 없습니다.
            </p>
          ) : (
            <div className="space-y-2">
              {coverLetters.slice(0, 5).map((cl) => (
                <Link
                  key={cl.id}
                  href={`/cover-letters/${cl.id}`}
                  className="flex items-center justify-between rounded-card border border-line px-4 py-3 text-sm transition-colors hover:border-ink"
                >
                  <span className="text-ink">
                    {cl.companyName || "무제"} · {cl.jobTitle || "-"}
                  </span>
                  <span className="font-mono text-label text-fog">{formatDate(cl.updatedAt)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
