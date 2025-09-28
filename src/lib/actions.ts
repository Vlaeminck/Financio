'use server';

import { autoCategorizeExpense } from '@/ai/flows/auto-categorize-expenses';

export async function suggestCategory(description: string) {
  if (!description) {
    return { error: 'La descripción es obligatoria.' };
  }
  
  try {
    const result = await autoCategorizeExpense({ description });
    return { category: result.category };
  } catch (e) {
    console.error(e);
    return { error: 'No se pudo obtener la sugerencia de la IA.' };
  }
}
