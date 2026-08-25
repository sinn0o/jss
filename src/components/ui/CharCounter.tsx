import { cn } from "@/lib/utils";

interface CharCounterProps {
  count: number;
  limit: number;
  className?: string;
}

export function CharCounter({ count, limit, className }: CharCounterProps) {
  const over = count > limit;
  const near = !over && limit > 0 && count / limit >= 0.9;

  return (
    <span
      className={cn(
        "font-mono text-label tabular-nums",
        over && "text-warn",
        !over && near && "text-seal",
        !over && !near && "text-fog",
        className,
      )}
    >
      {count}/{limit}
    </span>
  );
}
