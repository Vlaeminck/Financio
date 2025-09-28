'use server';

import { autoCategorizeExpense } from '@/ai/flows/auto-categorize-expenses';

export async function suggestCategory(description: string) {
  if (!description) {
    return { error: 'Description is required.' };
  }
  
  try {
    const result = await autoCategorizeExpense({ description });
    return { category: result.category };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to get suggestion from AI.' };
  }
}
