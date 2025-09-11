'use server';
/**
 * @fileOverview An AI agent that suggests learning resources for a specific course topic.
 *
 * - generateTopicSuggestions - A function that handles the suggestion generation.
 * - GenerateTopicSuggestionsInput - The input type for the function.
 * - GenerateTopicSuggestionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTopicSuggestionsInputSchema = z.object({
  courseTitle: z.string().describe('The title of the course.'),
  topic: z.string().describe('The specific topic within the course for which to generate suggestions.'),
});
export type GenerateTopicSuggestionsInput = z.infer<typeof GenerateTopicSuggestionsInputSchema>;

const YouTubeSuggestionSchema = z.object({
    title: z.string().describe("The title of the YouTube video."),
    url: z.string().url().describe("The full URL of the YouTube video."),
    description: z.string().describe("A brief, one-sentence summary of why this video is recommended."),
});

const QuizQuestionSchema = z.object({
    question: z.string().describe("The quiz question."),
    options: z.array(z.string()).describe("An array of 4 multiple-choice options."),
    answer: z.string().describe("The correct answer from the options."),
});

const GenerateTopicSuggestionsOutputSchema = z.object({
  youtubeSuggestions: z.array(YouTubeSuggestionSchema).describe("A list of 3-4 relevant YouTube video suggestions."),
  quiz: z.array(QuizQuestionSchema).describe("A short quiz with 3-5 multiple-choice questions."),
});
export type GenerateTopicSuggestionsOutput = z.infer<typeof GenerateTopicSuggestionsOutputSchema>;

export async function generateTopicSuggestions(input: GenerateTopicSuggestionsInput): Promise<GenerateTopicSuggestionsOutput> {
  return generateTopicSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTopicSuggestionsPrompt',
  input: {schema: GenerateTopicSuggestionsInputSchema},
  output: {schema: GenerateTopicSuggestionsOutputSchema},
  prompt: `You are an expert educator and curriculum designer. For the topic '{{{topic}}}' within the course '{{{courseTitle}}}', please provide the following learning resources:

1.  **YouTube Suggestions:** Find 3-4 highly relevant and reputable educational videos on YouTube that explain this topic clearly. For each video, provide its title, URL, and a brief one-sentence summary of why it's a good resource.

2.  **Quiz:** Create a short, high-quality quiz of 3-5 multiple-choice questions to test understanding of the topic. For each question, provide the question text, an array of 4 options, and the correct answer.

Structure the output as a single JSON object with two keys: "youtubeSuggestions" and "quiz".
`,
});

const generateTopicSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateTopicSuggestionsFlow',
    inputSchema: GenerateTopicSuggestionsInputSchema,
    outputSchema: GenerateTopicSuggestionsOutputSchema,
    retries: 2,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);