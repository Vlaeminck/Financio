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
    .describe('Una descripción detallada del gasto realizado.'),
});
export type AutoCategorizeExpenseInput = z.infer<typeof AutoCategorizeExpenseInputSchema>;

const AutoCategorizeExpenseOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'La categoría sugerida para el gasto, elegida de una lista predefinida (por ejemplo, Comestibles, Servicios, Entretenimiento).' 
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
  prompt: `Dada la siguiente descripción de un gasto, sugiere la categoría más apropiada de la siguiente lista: Comestibles, Transporte, Vivienda, Comida, Servicios, Entretenimiento, Salud, Educación, Regalos, Otros.

Descripción del Gasto: {{{description}}}

Categoría:`,
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
