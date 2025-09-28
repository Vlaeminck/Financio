import type { Transaction, Category, Budget } from './types';
import { Icons } from '@/components/icons';

export const CATEGORIES: Category[] = [
  { value: 'Groceries', label: 'Groceries', icon: Icons.groceries },
  { value: 'Transportation', label: 'Transportation', icon: Icons.transportation },
  { value: 'Housing', label: 'Housing', icon: Icons.housing },
  { value: 'Food', label: 'Food', icon: Icons.food },
  { value: 'Utilities', label: 'Utilities', icon: Icons.utilities },
  { value: 'Entertainment', label: 'Entertainment', icon: Icons.entertainment },
  { value: 'Healthcare', label: 'Healthcare', icon: Icons.healthcare },
  { value: 'Education', label: 'Education', icon: Icons.education },
  { value: 'Gifts', label: 'Gifts', icon: Icons.gifts },
  { value: 'Other', label: 'Other', icon: Icons.other },
];

export const TRANSACTIONS: Transaction[] = [
  { id: '1', date: new Date('2024-07-15'), description: 'Monthly Salary', amount: 5000, type: 'income', category: 'Salary' },
  { id: '2', date: new Date('2024-07-16'), description: 'Grocery shopping at Market', amount: 150.75, type: 'expense', category: 'Groceries' },
  { id: '3', date: new Date('2024-07-16'), description: 'Gasoline for car', amount: 45.50, type: 'expense', category: 'Transportation' },
  { id: '4', date: new Date('2024-07-17'), description: 'Dinner with friends', amount: 85.00, type: 'expense', category: 'Food' },
  { id: '5', date: new Date('2024-07-18'), description: 'Electricity Bill', amount: 75.00, type: 'expense', category: 'Utilities' },
  { id: '6', date: new Date('2024-07-20'), description: 'Movie tickets', amount: 30.00, type: 'expense', category: 'Entertainment' },
  { id: '7', date: new Date('2024-07-22'), description: 'Freelance Project Payment', amount: 750, type: 'income', category: 'Freelance' },
  { id: '8', date: new Date('2024-07-23'), description: 'New shoes', amount: 120.00, type: 'expense', category: 'Shopping' },
  { id: '9', date: new Date('2024-07-25'), description: 'Monthly Rent', amount: 1200.00, type: 'expense', category: 'Housing' },
  { id: '10', date: new Date('2024-07-28'), description: 'Pharmacy', amount: 25.30, type: 'expense', category: 'Healthcare' },
  { id: '11', date: new Date('2024-08-01'), description: 'Weekly groceries', amount: 95.20, type: 'expense', category: 'Groceries' },
  { id: '12', date: new Date('2024-08-02'), description: 'Lunch at cafe', amount: 18.90, type: 'expense', category: 'Food' },
  { id: '13', date: new Date('2024-08-03'), description: 'Online course subscription', amount: 49.99, type: 'expense', category: 'Education' },
  { id: '14', date: new Date('2024-08-05'), description: 'Public transport pass', amount: 55.00, type: 'expense', category: 'Transportation' },
];

const calculateSpent = (category: string) => {
    return TRANSACTIONS
        .filter(t => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
}

export const BUDGETS: Budget[] = [
  { id: '1', category: 'Groceries', amount: 400, spent: calculateSpent('Groceries') },
  { id: '2', category: 'Food', amount: 250, spent: calculateSpent('Food') },
  { id: '3', category: 'Transportation', amount: 150, spent: calculateSpent('Transportation') },
  { id: '4', category: 'Entertainment', amount: 100, spent: calculateSpent('Entertainment') },
  { id: '5', category: 'Housing', amount: 1200, spent: calculateSpent('Housing') },
  { id: '6', category: 'Utilities', amount: 150, spent: calculateSpent('Utilities') }
];
