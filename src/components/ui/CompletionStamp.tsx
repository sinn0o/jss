import { Check } from "lucide-react";

/**
 * DESIGN.md 4장 — 시그니처 요소 "완료 스탬프".
 * 문항 생성이 끝났을 때만 렌더링되어야 하며, 부모가 key를 바꿔주면
 * 리마운트되며 stamp-in 애니메이션(scale 0.9→1.0, 150ms)이 재생된다.
 */
export function CompletionStamp() {
  return (
    <span
      className="animate-stamp flex h-6 w-6 items-center justify-center rounded-full bg-seal text-white"
      aria-label="생성 완료"
      title="생성 완료"
    >
      <Check size={14} strokeWidth={3} />
    </span>
  );
}
