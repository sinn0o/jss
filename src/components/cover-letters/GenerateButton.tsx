import { Button } from "@/components/ui/Button";

interface GenerateButtonProps {
  onClick: () => void;
  loading: boolean;
  hasResult: boolean;
}

export function GenerateButton({ onClick, loading, hasResult }: GenerateButtonProps) {
  return (
    <Button type="button" variant="primary" onClick={onClick} disabled={loading} className="w-full py-2.5">
      {loading ? "생성 중..." : hasResult ? "전체 재생성" : "자소서 생성"}
    </Button>
  );
}
