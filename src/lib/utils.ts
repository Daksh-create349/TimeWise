"use client"

import { type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/cn";

export function isDateRange(date: any): date is DateRange {
  return date && typeof date === 'object' && date.from && date.to;
}
