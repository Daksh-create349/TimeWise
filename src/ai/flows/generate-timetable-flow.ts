
'use server';
/**
 * @fileOverview An AI agent that generates a university weekly timetable.
 *
 * - generateTimetable - A function that handles timetable generation.
 * - GenerateTimetableInput - The input type for the generateTimetable function.
 * - GenerateTimetableOutput - The return type for the generateTimetable function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Schedule } from '@/context/TimetableContext';


const GenerateTimetableInputSchema = z.object({
  subjects: z.array(z.string()).describe('List of subjects to include in the timetable.'),
  faculty: z.array(z.string()).describe('List of available faculty members.'),
  constraints: z.string().optional().describe('Any additional constraints or preferences for scheduling, e.g., "No classes on Friday afternoons", "Dr. Smith prefers morning classes".'),
});
export type GenerateTimetableInput = z.infer<typeof GenerateTimetableInputSchema>;


const ScheduledEventSchema = z.object({
    subject: z.string().describe("The subject or event name."),
    teacher: z.string().optional().describe("The faculty member assigned."),
    room: z.string().optional().describe("The classroom or location assigned."),
});

const DayScheduleSchema = z.object({
    Monday: ScheduledEventSchema.optional(),
    Tuesday: ScheduledEventSchema.optional(),
    Wednesday: ScheduledEventSchema.optional(),
    Thursday: ScheduledEventSchema.optional(),
    Friday: ScheduledEventSchema.optional(),
});

const GenerateTimetableOutputSchema = z.object({
  schedule: z.record(z.string(), DayScheduleSchema).describe("The generated weekly timetable schedule as a JSON object. The keys are time slots (e.g., '9:00 AM') and values are objects with days of the week as keys."),
});
export type GenerateTimetableOutput = z.infer<typeof GenerateTimetableOutputSchema>;


export async function generateTimetable(input: GenerateTimetableInput): Promise<GenerateTimetableOutput> {
  return generateTimetableFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTimetablePrompt',
  input: {schema: GenerateTimetableInputSchema},
  output: {schema: GenerateTimetableOutputSchema},
  prompt: `You are an expert university scheduler. Your task is to create a balanced and logical weekly timetable for a 5-day week (Monday to Friday) with 8 time slots per day: 9:00 AM, 10:00 AM, 11:00 AM, 12:00 PM, 1:00 PM, 2:00 PM, 3:00 PM, 4:00 PM.

  Your output MUST be a JSON object with a single root key 'schedule'. The keys of this object should be time slots (e.g., "9:00 AM") and the values should be objects with the days of the week as keys.

  Available Subjects:
  {{#each subjects}}
  - {{{this}}}
  {{/each}}

  Available Faculty:
  {{#each faculty}}
  - {{{this}}}
  {{/each}}

  {{#if constraints}}
  Constraints to follow:
  {{{constraints}}}
  {{/if}}

  CRITICAL Rules:
  1.  A faculty member CANNOT be assigned to teach two different classes at the exact same time slot on the same day.
  2.  Each time slot must be filled for each day.
  3.  The 12:00 PM slot MUST always have "Break" as the subject. For breaks, the 'teacher' and 'room' fields should be omitted.
  4.  Distribute subjects evenly throughout the week. Avoid scheduling the same subject back-to-back on the same day.
  5.  Assign a faculty member and a classroom (e.g., "Room 101", "Lab A", "Hall 3") to each class (except for breaks).
  6.  Ensure a logical flow and a balanced workload for both students and faculty.
  7.  Adhere to all user-provided constraints strictly.
  
  Generate the timetable and provide the output as a JSON object.
  `,
});

const generateTimetableFlow = ai.defineFlow(
  {
    name: 'generateTimetableFlow',
    inputSchema: GenerateTimetableInputSchema,
    outputSchema: GenerateTimetableOutputSchema,
    retries: 2,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
