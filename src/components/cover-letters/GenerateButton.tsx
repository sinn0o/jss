import { Button } from "@/components/ui/Button";

interface GenerateButtonProps {
  onClick: () => void;
  loading: boolean;
  loadingMessage?: string;
  hasResult: boolean;
}

export function GenerateButton({ onClick, loading, loadingMessage, hasResult }: GenerateButtonProps) {
  return (
    <Button type="button" variant="primary" onClick={onClick} disabled={loading} className="w-full py-2.5">
      {loading ? loadingMessage || "생성 중..." : hasResult ? "전체 재생성" : "자소서 생성"}
    </Button>
  );
}
