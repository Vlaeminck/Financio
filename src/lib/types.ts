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
  id: string;
  name: string;
  quantity: number;
  price: number;
  valueUsd: number;
  valueArs: number;
}
