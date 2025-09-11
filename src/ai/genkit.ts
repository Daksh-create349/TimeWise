import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

if (process.env.NODE_ENV === 'development' && !process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable not set for local development');
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
