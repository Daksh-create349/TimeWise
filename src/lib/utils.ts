import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { DateRange } from "react-day-picker";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isDateRange(date: any): date is DateRange {
  return date && typeof date === 'object' && 'from' in date && 'to' in date;
}
