'use server';
/**
 * @fileOverview An AI agent that generates a university fee receipt.
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
  receiptText: z.string().describe('The generated receipt as a formatted text string.'),
});
export type GenerateReceiptOutput = z.infer<typeof GenerateReceiptOutputSchema>;

export async function generateReceipt(input: GenerateReceiptInput): Promise<GenerateReceiptOutput> {
  return generateReceiptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReceiptPrompt',
  input: {schema: GenerateReceiptInputSchema},
  prompt: `Generate a professional, well-formatted text-based official university fee receipt for "TimeWise University".

  The receipt must contain the following details clearly laid out:
  - Header: "Official Fee Receipt"
  - University Name: "TimeWise University"
  - Student Name: "{{studentName}}"
  - Student ID: "{{studentId}}"
  - Transaction ID: "{{transactionId}}"
  - Date of Payment: "{{date}}"
  - Description: "{{description}}"
  - Payment Method: "{{method}}"
  - Amount Paid: "₹{{amount}}"
  - Status: "Paid"

  Format it cleanly with clear labels and values. Use newlines for spacing.
  `,
});

const generateReceiptFlow = ai.defineFlow(
  {
    name: 'generateReceiptFlow',
    inputSchema: GenerateReceiptInputSchema,
    outputSchema: GenerateReceiptOutputSchema,
  },
  async (input) => {
    const {text} = await prompt(input);
    return {receiptText: text};
  }
);
