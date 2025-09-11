
'use server';
/**
 * @fileOverview An AI agent that generates a university weekly timetable for multiple batches.
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
  batches: z.array(z.string()).describe('List of student batches to generate timetables for.'),
  constraints: z.string().optional().describe('Any additional constraints or preferences for scheduling, e.g., "No classes on Friday afternoons", "Dr. Smith prefers morning classes".'),
});
export type GenerateTimetableInput = z.infer<typeof GenerateTimetableInputSchema>;

const DayScheduleSchema = z.object({
  subject: z.string(),
  teacher: z.string().optional(),
  room: z.string().optional(),
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

const BatchTimetableSchema = z.record(z.string(), TimetableSchema);


const GenerateTimetableOutputSchema = z.object({
  schedules: BatchTimetableSchema.describe("The generated weekly timetables for each batch. The top-level keys should be the batch names, and each value should be a complete timetable schedule for that batch."),
});
export type GenerateTimetableOutput = z.infer<typeof GenerateTimetableOutputSchema>;

export async function generateTimetable(input: GenerateTimetableInput): Promise<GenerateTimetableOutput> {
  return generateTimetableFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTimetablePrompt',
  input: {schema: GenerateTimetableInputSchema},
  output: {schema: GenerateTimetableOutputSchema},
  prompt: `You are an expert university scheduler. Your task is to create balanced and logical weekly timetables for multiple student batches for a 5-day week (Monday to Friday) with 8 time slots per day: 9:00 AM, 10:00 AM, 11:00 AM, 12:00 PM, 1:00 PM, 2:00 PM, 3:00 PM, 4:00 PM.

  Batches to schedule:
  {{#each batches}}
  - {{{this}}}
  {{/each}}

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
  1.  **No Faculty Clashes:** A faculty member CANNOT be assigned to teach two different classes in two different batches at the exact same time slot on the same day. This is the most important rule.
  2.  Each time slot must be filled for each day for every batch.
  3.  The 12:00 PM slot MUST always have "Break" as the subject for all batches, and the 'teacher' and 'room' fields should be omitted for this slot.
  4.  Distribute subjects evenly throughout the week for each batch. Avoid scheduling the same subject back-to-back on the same day for the same batch.
  5.  Assign a faculty member and a classroom (e.g., "Room 101", "Lab A", "Hall 3") to each class (except for breaks).
  6.  Ensure a logical flow and a balanced workload for both students and faculty.
  7.  Adhere to all user-provided constraints strictly.
  
  Generate the timetables and provide the output in the specified JSON format. The top-level 'schedules' object must contain a key for each batch name provided in the input.`,
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
