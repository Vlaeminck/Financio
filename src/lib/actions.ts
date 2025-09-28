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


export async function searchCoins(query: string) {
  if (!query) return [];
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`, {
      headers: {
        'x-cg-demo-api-key': process.env.COINGECKO_API_KEY!,
      },
    });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.coins.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      thumb: coin.thumb,
    }));
  } catch (error) {
    console.error('Error searching coins:', error);
    return [];
  }
}

export async function getCoinPrices(ids: string[]) {
  if (ids.length === 0) return {};
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`, {
       headers: {
        'x-cg-demo-api-key': process.env.COINGECKO_API_KEY!,
      },
    });
    if (!response.ok) {
      return {};
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching prices:', error);
    return {};
  }
}

export async function getDolarCriptoRate() {
  try {
    const response = await fetch('https://dolarapi.com/v1/dolares/cripto', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      console.error('Error fetching dolar api');
      return null;
    }
    const data = await response.json();
    return data.venta; 
  } catch (error) {
    console.error('Error fetching dolar rate:', error);
    return null;
  }
}

export async function getFearAndGreedIndex() {
  try {
    const response = await fetch('https://api.alternative.me/fng/?limit=1', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!response.ok) {
      console.error('Error fetching Fear & Greed Index');
      return null;
    }
    const data = await response.json();
    return data.data[0];
  } catch (error) {
    console.error('Error fetching Fear & Greed Index:', error);
    return null;
  }
}
