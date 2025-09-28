
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
import { Checkbox } from '@/components/ui/checkbox';

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
  const [expenses, setExpenses] = useState(initialExpenses.map(e => ({...e, paid: e.amount > 0 ? false : true })));

  const handleExpenseChange = (id: string, field: keyof Transaction, value: any) => {
    setExpenses(expenses.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

   const handlePaidChange = (id: string, paid: boolean) => {
    setExpenses(
      expenses.map(exp => (exp.id === id ? { ...exp, paid } : exp))
    );
  };

  const addNewExpense = () => {
    const newExpense: Transaction & { paid: boolean } = {
      id: `expense-${Date.now()}`,
      date: new Date(),
      description: '',
      amount: 0,
      type: 'expense',
      category: 'Otros',
      notes: '',
      paid: false,
    };
    setExpenses([...expenses, newExpense]);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  return (
    <Card className="h-fit">
      <CardHeader className="p-0">
        <CardTitle className="bg-purple-600 text-white m-0 p-2 rounded-t-lg text-base">GASTOS</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow 
                key={expense.id}
                className={cn(
                  'border-b-0',
                  (expense.amount > 0 && !expense.paid) && 'bg-red-200',
                  expense.paid && 'bg-green-200'
                )}
              >
                <TableCell className="font-medium p-0">
                  <Input
                    type="text"
                    value={expense.category}
                    onChange={(e) => handleExpenseChange(expense.id, 'category', e.target.value)}
                    className="h-full py-1 px-2 text-sm bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full rounded-none"
                  />
                </TableCell>
                <TableCell className={cn("text-right font-medium p-0")}>
                   <Input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => handleExpenseChange(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                    className="h-full py-1 px-2 text-sm bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-right w-full rounded-none"
                  />
                </TableCell>
                <TableCell className="p-0">
                   <Input
                    type="text"
                    value={expense.notes}
                    onChange={(e) => handleExpenseChange(expense.id, 'notes', e.target.value)}
                    className="h-full py-1 px-2 text-sm bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full rounded-none"
                  />
                </TableCell>
                <TableCell className="p-1 w-10 text-center align-middle">
                  <Checkbox
                    checked={expense.paid}
                    onCheckedChange={(checked) => handlePaidChange(expense.id, !!checked)}
                    className="border-gray-500 rounded-sm"
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold bg-green-200 border-b-0">
                <TableCell className="p-2">GASTO GENERAL</TableCell>
                <TableCell className="text-right p-2">${formatCurrency(totalExpenses)}</TableCell>
                <TableCell className="p-2" colSpan={2}></TableCell>
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
