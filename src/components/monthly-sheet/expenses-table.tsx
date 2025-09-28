
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transaction } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

type ExpensesTableProps = {
  expenses: Transaction[];
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
};

export function ExpensesTable({ expenses: initialExpenses }: ExpensesTableProps) {
  const [expenses, setExpenses] = useState(initialExpenses);

  const handleExpenseChange = (id: string, field: keyof Transaction, value: any) => {
    setExpenses(expenses.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  const addNewExpense = () => {
    const newExpense: Transaction = {
      id: `expense-${Date.now()}`,
      date: new Date(),
      description: '',
      amount: 0,
      type: 'expense',
      category: 'Otros',
      notes: '',
    };
    setExpenses([...expenses, newExpense]);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  return (
    <Card className="h-fit">
      <CardHeader className="p-0">
        <CardTitle className="bg-blue-600 text-white m-0 p-2 rounded-t-lg text-base">GASTOS</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium px-2 py-1">
                  <Input
                    type="text"
                    value={expense.category}
                    onChange={(e) => handleExpenseChange(expense.id, 'category', e.target.value)}
                    className="h-7 p-1 text-sm bg-transparent border-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </TableCell>
                <TableCell className={cn("text-right font-medium text-white px-2 py-1", expense.amount > 0 ? 'bg-red-500' : 'bg-transparent')}>
                   <Input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => handleExpenseChange(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                    className="h-7 p-1 text-sm bg-transparent border-none focus-visible:ring-1 focus-visible:ring-ring text-right"
                  />
                </TableCell>
                <TableCell className="px-2 py-1">
                   <Input
                    type="text"
                    value={expense.notes}
                    onChange={(e) => handleExpenseChange(expense.id, 'notes', e.target.value)}
                    className="h-7 p-1 text-sm bg-transparent border-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold bg-green-200">
                <TableCell className="px-2 py-1">GASTO GENERAL</TableCell>
                <TableCell className="text-right px-2 py-1">${formatCurrency(totalExpenses)}</TableCell>
                <TableCell className="px-2 py-1"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="p-2">
            <Button onClick={addNewExpense} size="sm" className="w-full">
                <Icons.add className="mr-2 h-4 w-4" />
                Añadir Gasto
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
