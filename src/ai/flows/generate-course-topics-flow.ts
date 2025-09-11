
'use server';
/**
 * @fileOverview An AI agent that generates a list of topics for a given course.
 *
 * - generateCourseTopics - A function that handles the topic generation.
 * - GenerateCourseTopicsInput - The input type for the function.
 * - GenerateCourseTopicsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCourseTopicsInputSchema = z.object({
  courseTitle: z.string().describe('The title of the course for which to generate topics.'),
});
export type GenerateCourseTopicsInput = z.infer<typeof GenerateCourseTopicsInputSchema>;

const GenerateCourseTopicsOutputSchema = z.object({
  topics: z.array(z.string()).describe('A list of 10-15 relevant topics for the course.'),
});
export type GenerateCourseTopicsOutput = z.infer<typeof GenerateCourseTopicsOutputSchema>;

export async function generateCourseTopics(input: GenerateCourseTopicsInput): Promise<GenerateCourseTopicsOutput> {
  return generateCourseTopicsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCourseTopicsPrompt',
  input: {schema: GenerateCourseTopicsInputSchema},
  output: {schema: GenerateCourseTopicsOutputSchema},
  prompt: `You are an expert curriculum designer for a university.
  Your task is to generate a detailed list of 10 to 15 relevant course topics for a given course title.
  These topics should be structured like a syllabus, starting from foundational concepts and progressing to more advanced topics.

  Course Title: {{{courseTitle}}}

  Generate the topics and provide the output as a JSON object with a single key "topics", which contains an array of strings.
  `,
});

const generateCourseTopicsFlow = ai.defineFlow(
  {
    name: 'generateCourseTopicsFlow',
    inputSchema: GenerateCourseTopicsInputSchema,
    outputSchema: GenerateCourseTopicsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
