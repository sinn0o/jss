import { forwardRef } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const FIELD_BASE =
  "w-full rounded-input border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-fog outline-none transition-colors focus:border-[1.5px] focus:border-seal";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(FIELD_BASE, className)} {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(FIELD_BASE, "resize-y leading-relaxed", className)} {...props} />
));
Textarea.displayName = "Textarea";
