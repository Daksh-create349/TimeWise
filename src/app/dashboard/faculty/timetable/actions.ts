
"use server";

import { generateTimetable } from "@/ai/flows/generate-timetable-flow";
import type { GenerateTimetableInput, GenerateTimetableOutput } from "@/ai/flows/generate-timetable-flow";

export interface TimetableGeneratorState {
  data: GenerateTimetableOutput | null;
  error: string | null;
}

export async function generateTimetableAction(
  input: GenerateTimetableInput,
): Promise<TimetableGeneratorState> {

  if (!input.subjects || input.subjects.length === 0 || !input.faculty || input.faculty.length === 0 || !input.batches || input.batches.length === 0) {
    return { data: null, error: "Please provide at least one batch, one subject, and one faculty member." };
  }

  try {
    const result = await generateTimetable(input);
    if (!result?.schedules) {
      return { data: null, error: "The AI returned an unexpected response. Please try again." };
    }
    return { data: result, error: null };
  } catch(e: any) {
    console.error(e);
    return { data: null, error: e.message || "An unknown error occurred with the AI. Please try again later." };
  }
}
