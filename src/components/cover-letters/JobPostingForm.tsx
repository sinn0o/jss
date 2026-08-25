import { Input, Textarea } from "@/components/ui/Input";

export interface JobInfoValue {
  companyName: string;
  jobTitle: string;
  qualification: string;
  preference: string;
  jobPostingRaw: string;
}

interface JobPostingFormProps {
  value: JobInfoValue;
  onChange: (value: JobInfoValue) => void;
}

export function JobPostingForm({ value, onChange }: JobPostingFormProps) {
  const set = <K extends keyof JobInfoValue>(key: K, v: JobInfoValue[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <section className="space-y-4">
      <h2 className="text-h3 text-ink">공고 정보</h2>
      <div className="grid grid-cols-2 gap-3">
        <Input
          value={value.companyName}
          onChange={(e) => set("companyName", e.target.value)}
          placeholder="회사명"
        />
        <Input
          value={value.jobTitle}
          onChange={(e) => set("jobTitle", e.target.value)}
          placeholder="직무명"
        />
      </div>
      <Textarea
        rows={3}
        value={value.qualification}
        onChange={(e) => set("qualification", e.target.value)}
        placeholder="지원자격을 붙여넣으세요"
      />
      <Textarea
        rows={3}
        value={value.preference}
        onChange={(e) => set("preference", e.target.value)}
        placeholder="우대사항을 붙여넣으세요"
      />
      <details className="group">
        <summary className="cursor-pointer text-sm text-fog hover:text-ink">
          채용공고 전문 (선택 — 붙여넣으면 키워드 추출 정확도가 올라갑니다)
        </summary>
        <Textarea
          rows={5}
          className="mt-2"
          value={value.jobPostingRaw}
          onChange={(e) => set("jobPostingRaw", e.target.value)}
          placeholder="공고 전문 붙여넣기"
        />
      </details>
    </section>
  );
}
