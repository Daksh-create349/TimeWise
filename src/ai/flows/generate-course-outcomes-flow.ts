
'use server';
/**
 * @fileOverview An AI agent that defines course and program outcomes.
 *
 * - generateCourseOutcomes - A function that handles outcome generation.
 * - GenerateCourseOutcomesInput - The input type for the function.
 * - GenerateCourseOutcomesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCourseOutcomesInputSchema = z.object({
  courseTitle: z.string().describe('The title of the course.'),
});
export type GenerateCourseOutcomesInput = z.infer<typeof GenerateCourseOutcomesInputSchema>;

const OutcomeSchema = z.object({
  id: z.string().describe("The ID of the outcome (e.g., 'CO1', 'PO1')."),
  description: z.string().describe("The detailed description of the outcome."),
});

const GenerateCourseOutcomesOutputSchema = z.object({
  courseOutcomes: z.array(OutcomeSchema).describe('A list of Course Outcomes (COs).'),
  programOutcomes: z.array(OutcomeSchema).describe('A list of related Program Outcomes (POs).'),
});
export type GenerateCourseOutcomesOutput = z.infer<typeof GenerateCourseOutcomesOutputSchema>;

export async function generateCourseOutcomes(input: GenerateCourseOutcomesInput): Promise<GenerateCourseOutcomesOutput> {
  return generateCourseOutcomesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCourseOutcomesPrompt',
  input: {schema: GenerateCourseOutcomesInputSchema},
  output: {schema: GenerateCourseOutcomesOutputSchema},
  prompt: `You are an expert in academic accreditation. For the course '{{{courseTitle}}}', define the learning outcomes.

  Your response must include:
  1.  **Course Outcomes (COs):** A list of 4-5 specific, measurable outcomes that students should achieve by the end of the course. Use IDs like 'CO1', 'CO2', etc.
  2.  **Program Outcomes (POs):** A list of 3-4 broader program-level outcomes that this course contributes to. Use IDs like 'PO1', 'PO2', etc. These should relate to general skills like 'Engineering knowledge', 'Problem analysis', 'Modern tool usage', etc.

  Provide the output as a single JSON object with two keys: "courseOutcomes" and "programOutcomes". Each should contain an array of outcome objects.
  `,
});

const generateCourseOutcomesFlow = ai.defineFlow(
  {
    name: 'generateCourseOutcomesFlow',
    inputSchema: GenerateCourseOutcomesInputSchema,
    outputSchema: GenerateCourseOutcomesOutputSchema,
    retries: 2,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
