"use server";

import { aiCourseSuggestion } from "@/ai/ai-course-suggestion";
import type { AiCourseSuggestionOutput } from "@/ai/ai-course-suggestion";

export interface AiSuggesterState {
  data: AiCourseSuggestionOutput | null;
  error: string | null;
}

export async function getCourseSuggestions(
  prevState: AiSuggesterState,
  formData: FormData
): Promise<AiSuggesterState> {
  const topic = formData.get("topic");

  if (!topic || typeof topic !== "string" || topic.length < 10) {
    return { data: null, error: "Please provide a more detailed topic." };
  }

  try {
    const result = await aiCourseSuggestion({ topic: topic });
    if (!result?.suggestions) {
      return { data: null, error: "The AI returned an unexpected response. Please try again." };
    }
    return { data: result, error: null };
  } catch(e: any) {
    console.error(e);
    return { data: null, error: e.message || "An unknown error occurred with the AI. Please try again later." };
  }
}
