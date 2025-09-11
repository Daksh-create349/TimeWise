
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

// Tool to search YouTube. In a real app, this would use the YouTube API.
// Here we simulate it with a fixed result for a known topic.
const searchYouTube = ai.defineTool(
  {
    name: 'searchYouTube',
    description: 'Search for relevant educational videos on YouTube for a given topic.',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.array(
      z.object({
        title: z.string(),
        url: z.string().url(),
        description: z.string(),
      })
    ),
  },
  async ({ query }) => {
    console.log(`Searching YouTube for: ${query}`);
    // Simulate a real API call for a specific topic
    if (query.toLowerCase().includes('data structures')) {
      return [
        {
          title: 'Data Structures & Algorithms #1 - What Are Data Structures?',
          url: 'https://www.youtube.com/watch?v=bum_19loj9A',
          description: 'A great introduction to the fundamental concepts of data structures by Programiz.',
        },
        {
          title: 'Data Structures Easy to Advanced Course - Full Tutorial from a Google Engineer',
          url: 'https://www.youtube.com/watch?v=RBSGKlAcr1E',
          description: 'A comprehensive, in-depth tutorial from freeCodeCamp, suitable for all levels.',
        },
        {
            title: 'Top 6 Coding Interview Concepts (Data Structures & Algorithms)',
            url: 'https://www.youtube.com/watch?v=r1MXwyiGi_w',
            description: 'Focuses on the most common data structure concepts that appear in technical interviews.'
        }
      ];
    }
    // Return an empty array if the topic is not the one we have a real video for
    return [];
  }
);

export async function generateTopicSuggestions(input: GenerateTopicSuggestionsInput): Promise<GenerateTopicSuggestionsOutput> {
  return generateTopicSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTopicSuggestionsPrompt',
  input: {schema: GenerateTopicSuggestionsInputSchema},
  output: {schema: GenerateTopicSuggestionsOutputSchema},
  tools: [searchYouTube],
  prompt: `You are an expert educator and curriculum designer. For the topic '{{{topic}}}' within the course '{{{courseTitle}}}', please provide the following learning resources:

1.  **YouTube Suggestions:** Use the 'searchYouTube' tool to find 3-4 highly relevant and reputable educational videos that explain this topic clearly. If the tool returns no results, state that you could not find any videos.

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
