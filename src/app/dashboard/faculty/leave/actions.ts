
"use server";

import { generateLeaveRequest } from "@/ai/flows/generate-leave-request-flow";
import type { GenerateLeaveRequestInput, GenerateLeaveRequestOutput } from "@/ai/flows/generate-leave-request-flow";

export interface LeaveRequestState {
  data: GenerateLeaveRequestOutput | null;
  error: string | null;
}

export async function getLeaveRequestPreview(
  prevState: LeaveRequestState,
  formData: FormData
): Promise<LeaveRequestState> {
  const leaveType = formData.get("leaveType") as string;
  const fromDate = formData.get("fromDate") as string;
  const toDate = formData.get("toDate") as string;
  const reason = formData.get("reason") as string;
  const proxy = formData.get("proxy") as string | undefined;
  const notes = formData.get("notes") as string | undefined;

  if (!leaveType || !fromDate || !toDate || !reason) {
    return { data: null, error: null }; // Not an error, just incomplete form
  }

  try {
    const input: GenerateLeaveRequestInput = {
      leaveType,
      fromDate,
      toDate,
      reason,
      proxyArrangements: proxy,
      additionalNotes: notes,
      // Hardcoded faculty details for now
      facultyName: "Tanish",
      facultyTitle: "Associate Professor, Computer Science Department",
      facultyId: "tanish122",
    };
    const result = await generateLeaveRequest(input);
    if (!result?.emailBody) {
      return { data: null, error: "The AI returned an unexpected response. Please try again." };
    }
    return { data: result, error: null };
  } catch(e: any) {
    console.error(e);
    return { data: null, error: e.message || "An unknown error occurred with the AI. Please try again later." };
  }
}
