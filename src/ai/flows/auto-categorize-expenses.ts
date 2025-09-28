// Auto-categorize expenses using AI based on the description provided.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for automatically categorizing expenses based on a user-provided description.
 *
 * It includes:
 * - `autoCategorizeExpense`:  The main function to trigger the expense categorization flow.
 * - `AutoCategorizeExpenseInput`: The input type, expecting an expense description.
 * - `AutoCategorizeExpenseOutput`: The output type, providing a suggested expense category.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoCategorizeExpenseInputSchema = z.object({
  description: z
    .string()
    .describe('A detailed description of the expense incurred.'),
});
export type AutoCategorizeExpenseInput = z.infer<typeof AutoCategorizeExpenseInputSchema>;

const AutoCategorizeExpenseOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The suggested category for the expense, chosen from a predefined list (e.g., Groceries, Utilities, Entertainment).' 
    ),
});
export type AutoCategorizeExpenseOutput = z.infer<typeof AutoCategorizeExpenseOutputSchema>;

export async function autoCategorizeExpense(input: AutoCategorizeExpenseInput): Promise<AutoCategorizeExpenseOutput> {
  return autoCategorizeExpenseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoCategorizeExpensePrompt',
  input: {schema: AutoCategorizeExpenseInputSchema},
  output: {schema: AutoCategorizeExpenseOutputSchema},
  prompt: `Given the following expense description, suggest the most appropriate category from the following list: Groceries, Utilities, Entertainment, Transportation, Housing, Healthcare, Shopping, Food, Travel, Education, Bills, Others.

Expense Description: {{{description}}}

Category:`,
});

const autoCategorizeExpenseFlow = ai.defineFlow(
  {
    name: 'autoCategorizeExpenseFlow',
    inputSchema: AutoCategorizeExpenseInputSchema,
    outputSchema: AutoCategorizeExpenseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
