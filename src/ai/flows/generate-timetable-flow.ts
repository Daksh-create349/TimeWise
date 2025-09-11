
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

const GenerateTimetableInputSchema = z.object({
  subjects: z.array(z.string()).describe('List of subjects to include in the timetable.'),
  faculty: z.array(z.string()).describe('List of available faculty members.'),
  constraints: z.string().optional().describe('Any additional constraints or preferences for scheduling, e.g., "No classes on Friday afternoons", "Dr. Smith prefers morning classes".'),
});
export type GenerateTimetableInput = z.infer<typeof GenerateTimetableInputSchema>;

const DayScheduleSchema = z.object({
  subject: z.string(),
  teacher: z.string().optional(),
});

const TimetableDaySchema = z.object({
  Monday: DayScheduleSchema,
  Tuesday: DayScheduleSchema,
  Wednesday: DayScheduleSchema,
  Thursday: DayScheduleSchema,
  Friday: DayScheduleSchema,
});

const TimetableSchema = z.object({
  '9:00 AM': TimetableDaySchema,
  '10:00 AM': TimetableDaySchema,
  '11:00 AM': TimetableDaySchema,
  '12:00 PM': TimetableDaySchema,
  '1:00 PM': TimetableDaySchema,
  '2:00 PM': TimetableDaySchema,
  '3:00 PM': TimetableDaySchema,
  '4:00 PM': TimetableDaySchema,
});


const GenerateTimetableOutputSchema = z.object({
  schedule: TimetableSchema.describe("The generated weekly timetable. The top-level keys should be the 8 fixed time slots, and the values should be an object with keys for each day of the week ('Monday' through 'Friday')."),
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

  Rules:
  1.  Each time slot must be filled for each day.
  2.  The 12:00 PM slot MUST always have "Break" as the subject, and the 'teacher' field should be omitted for this slot.
  3.  Distribute subjects evenly throughout the week. Avoid scheduling the same subject back-to-back on the same day.
  4.  Assign a faculty member to each class (except for breaks). A faculty member cannot teach two different classes at the same time.
  5.  Ensure a logical flow and a balanced workload for both students and faculty.
  6.  Adhere to all user-provided constraints strictly.
  
  Generate the timetable and provide the output in the specified JSON format. The top-level keys of the 'schedule' object must be the 8 fixed time slots.`,
});

const generateTimetableFlow = ai.defineFlow(
  {
    name: 'generateTimetableFlow',
    inputSchema: GenerateTimetableInputSchema,
    outputSchema: GenerateTimetableOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
