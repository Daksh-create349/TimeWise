
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
  batches: z.array(z.string()).describe('List of student batches to generate timetables for (up to 4).'),
  constraints: z.string().optional().describe('Any additional constraints or preferences for scheduling, e.g., "No classes on Friday afternoons", "Dr. Smith prefers morning classes".'),
});
export type GenerateTimetableInput = z.infer<typeof GenerateTimetableInputSchema>;


const ScheduledEventSchema = z.object({
    batch: z.string().describe("The student batch for this event."),
    day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]).describe("The day of the week for this event."),
    time: z.enum(["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]).describe("The time slot for this event."),
    subject: z.string().describe("The subject or event name."),
    teacher: z.string().optional().describe("The faculty member assigned."),
    room: z.string().optional().describe("The classroom or location assigned."),
});

const GenerateTimetableOutputSchema = z.object({
  scheduleEvents: z.array(ScheduledEventSchema).describe("A flat list of all scheduled events for all batches."),
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

  Your output MUST be a flat list of schedule events, where each event is an object containing the batch, day, time, subject, teacher, and room.

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
  3.  The 12:00 PM slot MUST always have "Break" as the subject for all batches. For breaks, the 'teacher' and 'room' fields should be omitted.
  4.  Distribute subjects evenly throughout the week for each batch. Avoid scheduling the same subject back-to-back on the same day for the same batch.
  5.  Assign a faculty member and a classroom (e.g., "Room 101", "Lab A", "Hall 3") to each class (except for breaks).
  6.  Ensure a logical flow and a balanced workload for both students and faculty.
  7.  Adhere to all user-provided constraints strictly.
  
  Generate the timetables and provide the output as a JSON object with a single key "scheduleEvents" which is an array of all the scheduled classes/breaks for all batches.
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
