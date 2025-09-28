import type { Transaction, Category, Budget } from './types';
import { Icons } from '@/components/icons';

export const CATEGORIES: Category[] = [
  { value: 'Alquiler', label: 'Alquiler', icon: Icons.housing },
  { value: 'Mercadopago', label: 'Mercadopago', icon: Icons.dollar },
  { value: 'Internet', label: 'Internet', icon: Icons.utilities },
  { value: 'Gas', label: 'Gas', icon: Icons.utilities },
  { value: 'Edenor', label: 'Edenor', icon: Icons.utilities },
  { value: 'Naranja', label: 'Naranja', icon: Icons.income },
  { value: 'Galicia Prestamo', label: 'Galicia Prestamo', icon: Icons.income },
  { value: 'Comestibles', label: 'Comestibles', icon: Icons.groceries },
  { value: 'Transporte', label: 'Transporte', icon: Icons.transportation },
  { value: 'Vivienda', label: 'Vivienda', icon: Icons.housing },
  { value: 'Comida', label: 'Comida', icon: Icons.food },
  { value: 'Servicios', label: 'Servicios', icon: Icons.utilities },
  { value: 'Entretenimiento', label: 'Entretenimiento', icon: Icons.entertainment },
  { value: 'Salud', label: 'Salud', icon: Icons.healthcare },
  { value: 'Educación', label: 'Educación', icon: Icons.education },
  { value: 'Regalos', label: 'Regalos', icon: Icons.gifts },
  { value: 'Otros', label: 'Otros', icon: Icons.other },
];

export const TRANSACTIONS: Transaction[] = [
  { id: '1', date: new Date('2024-10-01'), description: 'GARDENIAS', amount: 1071000, type: 'income', category: 'Ingresos' },
  { id: '2', date: new Date('2024-10-02'), description: 'EXTRA', amount: 476896.80, type: 'income', category: 'Ingresos' },
  { id: '3', date: new Date('2024-10-05'), description: 'Alquiler', amount: 270000, type: 'expense', category: 'Alquiler', notes: '', paid: true },
  { id: '4', date: new Date('2024-10-10'), description: 'Mercadopago', amount: 0, type: 'expense', category: 'Mercadopago', notes: '', paid: true },
  { id: '5', date: new Date('2024-10-12'), description: 'Internet', amount: 22817, type: 'expense', category: 'Internet', notes: '', paid: false },
  { id: '6', date: new Date('2024-10-14'), description: 'Gas', amount: 42298, type: 'expense', category: 'Gas', notes: '', paid: false },
  { id: '7', date: new Date('2024-10-15'), description: 'Edenor', amount: 10003, type: 'expense', category: 'Edenor', notes: '', paid: false },
  { id: '8', date: new Date('2024-10-20'), description: 'Naranja', amount: 1041409, type: 'expense', category: 'Naranja', notes: '', paid: false },
  { id: '9', date: new Date('2024-10-25'), description: 'Galicia Prestamo', amount: 386206, type: 'expense', category: 'Galicia Prestamo', notes: '6 DE 6', paid: true },
];

const calculateSpent = (category: string) => {
    return TRANSACTIONS
        .filter(t => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
}

export const BUDGETS: Budget[] = [
  { id: '1', category: 'Comestibles', amount: 400, spent: calculateSpent('Comestibles') },
  { id: '2', category: 'Comida', amount: 250, spent: calculateSpent('Comida') },
  { id: '3', category: 'Transporte', amount: 150, spent: calculateSpent('Transporte') },
  { id: '4', category: 'Entretenimiento', amount: 100, spent: calculateSpent('Entretenimiento') },
  { id: '5', category: 'Vivienda', amount: 1200, spent: calculateSpent('Vivienda') },
  { id: '6', category: 'Servicios', amount: 150, spent: calculateSpent('Servicios') }
];
