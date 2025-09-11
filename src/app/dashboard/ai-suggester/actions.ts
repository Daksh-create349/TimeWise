"use server";

import { aiCourseSuggestion } from "@/ai/ai-course-suggestion";

export async function getCourseSuggestions(
  prevState: any,
  formData: FormData
) {
  const topic = formData.get("topic");

  if (!topic || typeof topic !== "string" || topic.length < 10) {
    return { data: null, error: "Please provide a more detailed topic." };
  }

  try {
    const result = await aiCourseSuggestion({ topic: topic });
    return { data: result, error: null };
  } catch(e: any) {
    console.error(e);
    return { data: null, error: "There was an issue with the AI. Please try again later." };
  }
}
