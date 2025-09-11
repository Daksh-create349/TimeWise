
'use server';
/**
 * @fileOverview An AI agent that generates a syllabus for a given course.
 *
 * - generateSyllabus - A function that handles the syllabus generation.
 * - GenerateSyllabusInput - The input type for the function.
 * - GenerateSyllabusOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSyllabusInputSchema = z.object({
  courseTitle: z.string().describe('The title of the course for which to generate a syllabus.'),
});
export type GenerateSyllabusInput = z.infer<typeof GenerateSyllabusInputSchema>;

const SyllabusSchema = z.object({
    courseDescription: z.string().describe("A brief, engaging description of the course."),
    learningObjectives: z.array(z.string()).describe("A list of 3-5 key learning objectives for the course."),
    evaluationCriteria: z.array(z.object({
        component: z.string().describe("The evaluation component (e.g., 'Midterm Exam', 'Assignments')."),
        weightage: z.string().describe("The weightage of the component (e.g., '30%').")
    })).describe("A list of evaluation components and their weightage."),
    recommendedTextbooks: z.array(z.string()).describe("A list of 1-3 recommended textbooks for the course.")
});

const GenerateSyllabusOutputSchema = z.object({
  syllabus: SyllabusSchema,
});
export type GenerateSyllabusOutput = z.infer<typeof GenerateSyllabusOutputSchema>;

export async function generateSyllabus(input: GenerateSyllabusInput): Promise<GenerateSyllabusOutput> {
  return generateSyllabusFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSyllabusPrompt',
  input: {schema: GenerateSyllabusInputSchema},
  output: {schema: GenerateSyllabusOutputSchema},
  prompt: `You are an expert curriculum designer. For the course titled '{{{courseTitle}}}', generate a detailed syllabus.

  The syllabus must include the following sections:
  1.  Course Description: A brief, engaging paragraph summarizing the course.
  2.  Learning Objectives: A list of 3-5 key learning objectives.
  3.  Evaluation Criteria: A breakdown of how students will be graded (e.g., Midterm Exam - 30%, Final Exam - 40%, Assignments - 20%, Attendance - 10%).
  4.  Recommended Textbooks: A list of 1 to 3 relevant textbooks.

  Provide the output as a single JSON object with a root key "syllabus".
  `,
});

const generateSyllabusFlow = ai.defineFlow(
  {
    name: 'generateSyllabusFlow',
    inputSchema: GenerateSyllabusInputSchema,
    outputSchema: GenerateSyllabusOutputSchema,
    retries: 2,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
