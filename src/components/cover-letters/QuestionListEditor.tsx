import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export interface EditableQuestion {
  id: string;
  question: string;
  charLimit: number;
}

interface QuestionListEditorProps {
  questions: EditableQuestion[];
  onChange: (questions: EditableQuestion[]) => void;
}

export function QuestionListEditor({ questions, onChange }: QuestionListEditorProps) {
  const update = (id: string, patch: Partial<EditableQuestion>) =>
    onChange(questions.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const remove = (id: string) => onChange(questions.filter((q) => q.id !== id));

  const add = () =>
    onChange([...questions, { id: crypto.randomUUID(), question: "", charLimit: 500 }]);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-h3 text-ink">문항</h2>
        <span className="font-mono text-label text-fog">{questions.length}개</span>
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={q.id} className="rounded-card border border-line p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-label text-fog">Q{i + 1}</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  value={q.charLimit}
                  onChange={(e) => update(q.id, { charLimit: Number(e.target.value) || 0 })}
                  className="w-20 py-1 font-mono text-label"
                />
                <span className="font-mono text-label text-fog">자</span>
                <button
                  type="button"
                  onClick={() => remove(q.id)}
                  className="text-fog hover:text-warn"
                  aria-label="문항 삭제"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <Input
              value={q.question}
              onChange={(e) => update(q.id, { question: e.target.value })}
              placeholder="예: 지원 동기를 서술하시오"
              className="mt-2"
            />
          </div>
        ))}
      </div>

      <Button type="button" variant="secondary" onClick={add} className="w-full">
        <Plus size={14} /> 문항 추가
      </Button>
    </section>
  );
}
