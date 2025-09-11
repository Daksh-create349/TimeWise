'use server';

/**
 * @fileOverview An AI agent that suggests courses, learning resources, and study strategies based on student performance.
 *
 * - aiCourseSuggestion - A function that handles the course suggestion process.
 * - AiCourseSuggestionInput - The input type for the aiCourseSuggestion function.
 * - AiCourseSuggestionOutput - The return type for the aiCourseSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiCourseSuggestionInputSchema = z.object({
  topic: z.string().describe('The course topic or project idea the student is interested in.'),
  studentPerformanceData: z.string().optional().describe('Student performance data, including assignment scores and feedback.'),
});
export type AiCourseSuggestionInput = z.infer<typeof AiCourseSuggestionInputSchema>;

const AiCourseSuggestionOutputSchema = z.object({
  suggestions: z.object({
    courses: z.array(z.string()).describe('A list of suggested courses.'),
    resources: z.array(z.string()).describe('A list of suggested learning resources (books, websites, etc.).'),
    studyStrategies: z.array(z.string()).describe('A list of actionable study strategies.'),
    summary: z.string().describe('A summary of the suggestions.'),
  }).describe('The AI-generated course suggestions.'),
});
export type AiCourseSuggestionOutput = z.infer<typeof AiCourseSuggestionOutputSchema>;


export async function aiCourseSuggestion(input: AiCourseSuggestionInput): Promise<AiCourseSuggestionOutput> {
  return aiCourseSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCourseSuggestionPrompt',
  input: {schema: AiCourseSuggestionInputSchema},
  output: {schema: AiCourseSuggestionOutputSchema},
  prompt: `You are an expert academic advisor. Analyze the student's interests and provide personalized suggestions for courses, learning resources, and actionable study strategies.

  Course Topic/Project Idea: {{{topic}}}

  {{#if studentPerformanceData}}
  Student Performance Data: {{{studentPerformanceData}}}
  Based on the student's performance data, provide specific recommendations tailored to their strengths and weaknesses.
  {{else}}
  Provide general recommendations suitable for a student interested in this topic.
  {{/if}}
  
  Please format your response as a JSON object with a single top-level key "suggestions", which contains "courses", "resources", "studyStrategies", and "summary".
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const aiCourseSuggestionFlow = ai.defineFlow(
  {
    name: 'aiCourseSuggestionFlow',
    inputSchema: AiCourseSuggestionInputSchema,
    outputSchema: AiCourseSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
