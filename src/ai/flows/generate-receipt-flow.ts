'use server';
/**
 * @fileOverview An AI agent that generates a university fee receipt image.
 *
 * - generateReceipt - A function that handles the receipt generation process.
 * - GenerateReceiptInput - The input type for the generateReceipt function.
 * - GenerateReceiptOutput - The return type for the generateReceipt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReceiptInputSchema = z.object({
  transactionId: z.string().describe('The unique identifier for the transaction.'),
  date: z.string().describe('The date of the transaction.'),
  description: z.string().describe('A brief description of the payment.'),
  amount: z.number().describe('The amount paid in the transaction.'),
  method: z.string().describe('The payment method used.'),
  studentName: z.string().describe('The full name of the student.'),
  studentId: z.string().describe('The student\'s ID.'),
});
export type GenerateReceiptInput = z.infer<typeof GenerateReceiptInputSchema>;

const GenerateReceiptOutputSchema = z.object({
  receiptImageUri: z.string().describe('The generated receipt image as a data URI.'),
});
export type GenerateReceiptOutput = z.infer<typeof GenerateReceiptOutputSchema>;

export async function generateReceipt(input: GenerateReceiptInput): Promise<GenerateReceiptOutput> {
  return generateReceiptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReceiptPrompt',
  input: {schema: GenerateReceiptInputSchema},
  prompt: `Generate an image of an official university fee receipt. The receipt should be for "TimeWise University".

  The receipt must contain the following details clearly laid out:
  - Header: "Official Fee Receipt"
  - University Name: "TimeWise University"
  - Student Name: "{{studentName}}"
  - Student ID: "{{studentId}}"
  - Transaction ID: "{{transactionId}}"
  - Date of Payment: "{{date}}"
  - Description: "{{description}}"
  - Payment Method: "{{method}}"
  - Amount Paid: "₹{{amount}}" in a prominent font.
  - A "Paid" stamp or watermark on the receipt.
  - A professional and clean layout with a simple border.
  - Do not include any logos or seals that you have to invent.
  `,
  config: {
    model: 'googleai/imagen-4.0-fast-generate-001',
  },
});

const generateReceiptFlow = ai.defineFlow(
  {
    name: 'generateReceiptFlow',
    inputSchema: GenerateReceiptInputSchema,
    outputSchema: GenerateReceiptOutputSchema,
  },
  async (input) => {
    const {media} = await prompt(input);
    if (!media) {
      throw new Error('Image generation failed.');
    }
    return {receiptImageUri: media.url};
  }
);
