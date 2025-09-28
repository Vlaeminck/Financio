import type { Transaction, Category, Budget } from './types';
import { Icons } from '@/components/icons';

export const CATEGORIES: Category[] = [
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
  { id: '1', date: new Date('2024-07-15'), description: 'Salario mensual', amount: 5000, type: 'income', category: 'Salario' },
  { id: '2', date: new Date('2024-07-16'), description: 'Compra en el supermercado', amount: 150.75, type: 'expense', category: 'Comestibles' },
  { id: '3', date: new Date('2024-07-16'), description: 'Gasolina para el coche', amount: 45.50, type: 'expense', category: 'Transporte' },
  { id: '4', date: new Date('2024-07-17'), description: 'Cena con amigos', amount: 85.00, type: 'expense', category: 'Comida' },
  { id: '5', date: new Date('2024-07-18'), description: 'Factura de electricidad', amount: 75.00, type: 'expense', category: 'Servicios' },
  { id: '6', date: new Date('2024-07-20'), description: 'Entradas de cine', amount: 30.00, type: 'expense', category: 'Entretenimiento' },
  { id: '7', date: new Date('2024-07-22'), description: 'Pago proyecto freelance', amount: 750, type: 'income', category: 'Freelance' },
  { id: '8', date: new Date('2024-07-23'), description: 'Zapatos nuevos', amount: 120.00, type: 'expense', category: 'Compras' },
  { id: '9', date: new Date('2024-07-25'), description: 'Alquiler mensual', amount: 1200.00, type: 'expense', category: 'Vivienda' },
  { id: '10', date: new Date('2024-07-28'), description: 'Farmacia', amount: 25.30, type: 'expense', category: 'Salud' },
  { id: '11', date: new Date('2024-08-01'), description: 'Comestibles semanales', amount: 95.20, type: 'expense', category: 'Comestibles' },
  { id: '12', date: new Date('2024-08-02'), description: 'Almuerzo en cafetería', amount: 18.90, type: 'expense', category: 'Comida' },
  { id: '13', date: new Date('2024-08-03'), description: 'Suscripción a curso online', amount: 49.99, type: 'expense', category: 'Educación' },
  { id: '14', date: new Date('2024-08-05'), description: 'Abono transporte público', amount: 55.00, type: 'expense', category: 'Transporte' },
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
