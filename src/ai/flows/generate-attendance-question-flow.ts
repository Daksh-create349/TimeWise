
'use server';
/**
 * @fileOverview An AI agent that generates a unique question for taking class attendance.
 *
 * - generateAttendanceQuestion - A function that handles the question generation process.
 * - GenerateAttendanceQuestionInput - The input type for the function.
 * - GenerateAttendanceQuestionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAttendanceQuestionInputSchema = z.object({
  subject: z.string().describe('The subject of the class, e.g., "Quantum Physics".'),
});
export type GenerateAttendanceQuestionInput = z.infer<typeof GenerateAttendanceQuestionInputSchema>;

const GenerateAttendanceQuestionOutputSchema = z.object({
  question: z.string().describe('A simple, unique question related to the subject that can be answered in a few words.'),
  answer: z.string().describe('A simple, one or two-word answer to the generated question.'),
});
export type GenerateAttendanceQuestionOutput = z.infer<typeof GenerateAttendanceQuestionOutputSchema>;

export async function generateAttendanceQuestion(input: GenerateAttendanceQuestionInput): Promise<GenerateAttendanceQuestionOutput> {
  return generateAttendanceQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAttendanceQuestionPrompt',
  input: {schema: GenerateAttendanceQuestionInputSchema},
  output: {schema: GenerateAttendanceQuestionOutputSchema},
  prompt: `You are an academic assistant. Your task is to generate a simple, unique question for taking attendance in a university class.
The question should be directly related to the provided subject and have a very simple, one or two-word answer.
This is to verify that students are present and paying attention.

Subject: {{{subject}}}

Generate a question and a concise answer. The question should be easy enough for a student of the subject to answer quickly.

Example for "History":
Question: "What was the name of the ship that carried the Pilgrims to America in 1620?"
Answer: "The Mayflower"

Example for "Biology":
Question: "What is the powerhouse of the cell?"
Answer: "Mitochondria"

Generate a new, different question each time.
`,
});

const generateAttendanceQuestionFlow = ai.defineFlow(
  {
    name: 'generateAttendanceQuestionFlow',
    inputSchema: GenerateAttendanceQuestionInputSchema,
    outputSchema: GenerateAttendanceQuestionOutputSchema,
    retries: 2,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
