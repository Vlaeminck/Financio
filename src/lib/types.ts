import type { LucideIcon } from 'lucide-react';

export type Transaction = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string; // category value
  notes?: string;
  valueUsd?: number;
  priceUsd?: number;
  paid?: boolean;
};

export type Category = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export type Budget = {
  id: string;
  category: string;
  amount: number;
  spent: number;
};

export type CryptoHolding = {
  id: string; // coingecko id
  name: string;
  symbol: string;
  quantity: number;
  price: number; // price in usd
  valueUsd: number;
  valueArs: number;
};
