import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function formatPeriod(startDate?: string, endDate?: string) {
  if (!startDate && !endDate) return "";
  if (startDate && endDate) return `${startDate} ~ ${endDate}`;
  return startDate ?? endDate ?? "";
}
