
'use server';
/**
 * @fileOverview An AI agent that generates various types of course content.
 *
 * - generateCourseContent - A function that handles the content generation.
 * - GenerateCourseContentInput - The input type for the function.
 * - GenerateCourseContentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCourseContentInputSchema = z.object({
  courseTitle: z.string().describe('The title of the course.'),
});
export type GenerateCourseContentInput = z.infer<typeof GenerateCourseContentInputSchema>;

const CourseContentSchema = z.object({
    contentType: z.string().describe("The type of content (e.g., 'Lecture Notes', 'Presentation Slides', 'Video Script')."),
    title: z.string().describe("The title of the content piece."),
    content: z.string().describe("The generated content itself (can be markdown).")
});

const GenerateCourseContentOutputSchema = z.object({
  courseContents: z.array(CourseContentSchema).describe('A list of generated course content pieces.'),
});
export type GenerateCourseContentOutput = z.infer<typeof GenerateCourseContentOutputSchema>;

export async function generateCourseContent(input: GenerateCourseContentInput): Promise<GenerateCourseContentOutput> {
  return generateCourseContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCourseContentPrompt',
  input: {schema: GenerateCourseContentInputSchema},
  output: {schema: GenerateCourseContentOutputSchema},
  prompt: `You are an expert educational content creator. For the course '{{{courseTitle}}}', generate three distinct pieces of introductory content:
  1.  **Lecture Notes:** A markdown-formatted document covering the key points of the first lecture.
  2.  **Presentation Slides:** A summary of a 5-slide presentation, with a title and bullet points for each slide.
  3.  **Video Script:** A short, engaging script for a 2-minute introductory video to the course.

  Structure the output as a JSON object with a single root key "courseContents", which contains an array of three content objects. Each object should have a "contentType", "title", and "content".
  `,
});

const generateCourseContentFlow = ai.defineFlow(
  {
    name: 'generateCourseContentFlow',
    inputSchema: GenerateCourseContentInputSchema,
    outputSchema: GenerateCourseContentOutputSchema,
    retries: 2,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
