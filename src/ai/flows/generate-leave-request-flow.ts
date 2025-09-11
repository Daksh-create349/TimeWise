
'use server';
/**
 * @fileOverview An AI agent that generates a professional leave request email for faculty.
 *
 * - generateLeaveRequest - A function that handles the email generation process.
 * - GenerateLeaveRequestInput - The input type for the function.
 * - GenerateLeaveRequestOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateLeaveRequestInputSchema = z.object({
  leaveType: z.string().describe('The type of leave being requested (e.g., Medical, Personal, Emergency).'),
  fromDate: z.string().describe('The start date of the leave period in YYYY-MM-DD format.'),
  toDate: z.string().describe('The end date of the leave period in YYYY-MM-DD format.'),
  reason: z.string().describe('The primary reason for the leave request.'),
  proxyArrangements: z.string().optional().describe('Details about who will cover classes or duties.'),
  additionalNotes: z.string().optional().describe('Any other relevant information.'),
  facultyName: z.string().describe('The name of the faculty member.'),
  facultyTitle: z.string().describe('The job title of the faculty member (e.g., "Associate Professor, Computer Science Department").'),
  facultyId: z.string().describe('The employee ID of the faculty member.'),
});
export type GenerateLeaveRequestInput = z.infer<typeof GenerateLeaveRequestInputSchema>;

export const GenerateLeaveRequestOutputSchema = z.object({
  emailBody: z.string().describe('The complete, formatted body of the leave request email.'),
});
export type GenerateLeaveRequestOutput = z.infer<typeof GenerateLeaveRequestOutputSchema>;

export async function generateLeaveRequest(input: GenerateLeaveRequestInput): Promise<GenerateLeaveRequestOutput> {
  return generateLeaveRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLeaveRequestPrompt',
  input: {schema: GenerateLeaveRequestInputSchema},
  output: {schema: GenerateLeaveRequestOutputSchema},
  prompt: `You are an assistant for university faculty. Your task is to generate a professional and clear leave request email body. Do not include the "Dear Administrator," salutation or the signature block.

The user will provide the following details. Generate the email body text based on them.

- Leave Type: {{{leaveType}}}
- From Date: {{{fromDate}}}
- To Date: {{{toDate}}}
- Reason: {{{reason}}}
{{#if proxyArrangements}}
- Proxy/Coverage: {{{proxyArrangements}}}
{{/if}}
{{#if additionalNotes}}
- Additional Notes: {{{additionalNotes}}}
{{/if}}

Start the email with "I am writing to formally request...".
Present the core leave details clearly, perhaps in a list format.
If proxy arrangements are provided, mention them.
If additional notes are provided, include them in a suitable paragraph.
End with a polite closing like "Thank you for your understanding and consideration."

Finally, generate the signature block as follows:
Best regards,
{{{facultyName}}}
{{{facultyTitle}}}
Employee ID: {{{facultyId}}}

IMPORTANT: Your entire output should be a single string inside the "emailBody" JSON key. Do not generate the salutation (e.g., "Dear Administrator,"). The final output should start from "I am writing to formally request..." and end with the employee ID.
`,
});

const generateLeaveRequestFlow = ai.defineFlow(
  {
    name: 'generateLeaveRequestFlow',
    inputSchema: GenerateLeaveRequestInputSchema,
    outputSchema: GenerateLeaveRequestOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
