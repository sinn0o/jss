import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TagProps {
  children: ReactNode;
  variant?: "neutral" | "seal";
  className?: string;
}

export function Tag({ children, variant = "neutral", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-input px-2 py-0.5 font-mono text-label",
        variant === "neutral" && "bg-panel text-fog",
        variant === "seal" && "border border-seal text-seal bg-seal-light",
        className,
      )}
    >
      {children}
    </span>
  );
}
