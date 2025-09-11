
'use server';
/**
 * @fileOverview An AI agent that generates a lesson plan for a course.
 *
 * - generateLessonPlan - A function that handles the lesson plan generation.
 * - GenerateLessonPlanInput - The input type for the function.
 * - GenerateLessonPlanOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLessonPlanInputSchema = z.object({
  courseTitle: z.string().describe('The title of the course.'),
});
export type GenerateLessonPlanInput = z.infer<typeof GenerateLessonPlanInputSchema>;

const WeeklyPlanSchema = z.object({
  week: z.string().describe("The week number (e.g., 'Week 1-2')."),
  topics: z.string().describe("The topics to be covered in that week."),
  activities: z.string().describe("The planned activities or assignments for that week."),
});

const GenerateLessonPlanOutputSchema = z.object({
  lessonPlan: z.array(WeeklyPlanSchema).describe('A list of weekly plans for an 8-week semester.'),
});
export type GenerateLessonPlanOutput = z.infer<typeof GenerateLessonPlanOutputSchema>;

export async function generateLessonPlan(input: GenerateLessonPlanInput): Promise<GenerateLessonPlanOutput> {
  return generateLessonPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLessonPlanPrompt',
  input: {schema: GenerateLessonPlanInputSchema},
  output: {schema: GenerateLessonPlanOutputSchema},
  prompt: `You are an expert curriculum designer. Generate a detailed week-by-week lesson plan for an 8-week semester for the course '{{{courseTitle}}}'.

  For each week (or pair of weeks, e.g., "Week 1-2"), provide:
  1. The main topics to be covered.
  2. The key activities, like lectures, labs, discussions, or assignments.

  Structure the output as a JSON object with a single root key "lessonPlan", which contains an array of weekly plan objects.
  `,
});

const generateLessonPlanFlow = ai.defineFlow(
  {
    name: 'generateLessonPlanFlow',
    inputSchema: GenerateLessonPlanInputSchema,
    outputSchema: GenerateLessonPlanOutputSchema,
    retries: 2,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
