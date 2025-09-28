'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
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
  onExpenseChange: (expense: Transaction) => void;
  onAddExpense: () => void;
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
};

export function ExpensesTable({ expenses, onExpenseChange, onAddExpense }: ExpensesTableProps) {
  
  const handleInputChange = (id: string, field: keyof Transaction, value: any) => {
    const expense = expenses.find(exp => exp.id === id);
    if (expense) {
        onExpenseChange({ ...expense, [field]: value });
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  return (
    <Card className="h-fit">
      <CardHeader className="p-0">
        <CardTitle className="bg-purple-600 text-primary-foreground m-0 p-2 rounded-t-lg text-base">GASTOS</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
            <TableHeader>
                <TableRow className="text-xs text-muted-foreground">
                    <TableHead className="h-auto p-2 font-medium">Nombre</TableHead>
                    <TableHead className="h-auto p-2 font-medium">Valor</TableHead>
                    <TableHead className="h-auto p-2 font-medium">Nota</TableHead>
                    <TableHead className="h-auto p-2 w-10"></TableHead>
                </TableRow>
            </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow 
                key={expense.id}
                className={cn(
                  'border-b-0',
                  !expense.paid && expense.amount > 0 ? 'bg-red-200' : 'bg-green-200'
                )}
              >
                <TableCell className="font-medium p-0">
                  <Input
                    type="text"
                    value={expense.category}
                    onChange={(e) => handleInputChange(expense.id, 'category', e.target.value)}
                    className="h-auto py-1 px-2 text-sm bg-transparent border-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 w-full rounded-none"
                  />
                </TableCell>
                <TableCell className={cn("text-right font-medium p-0 w-[100px]")}>
                   <Input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => handleInputChange(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                    className="h-auto py-1 px-2 text-sm bg-transparent border-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 text-right w-full rounded-none"
                  />
                </TableCell>
                <TableCell className="p-0 w-[80px]">
                   <Input
                    type="text"
                    value={expense.notes}
                    onChange={(e) => handleInputChange(expense.id, 'notes', e.target.value)}
                    className="h-auto py-1 px-2 text-sm bg-transparent border-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 w-full rounded-none"
                  />
                </TableCell>
                <TableCell className="p-1 w-10 text-center align-middle">
                  <Checkbox
                    checked={expense.paid}
                    onCheckedChange={(checked) => handleInputChange(expense.id, 'paid', !!checked)}
                    className="border-gray-500 rounded-sm h-5 w-5 border-2"
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold bg-green-200 border-b-0">
                <TableCell className="p-2">GASTO GENERAL</TableCell>
                <TableCell className="text-right p-2" colSpan={3}>{formatCurrency(totalExpenses)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="p-2">
            <Button onClick={onAddExpense} size="sm" className="w-full bg-green-800 hover:bg-green-900 text-white font-bold">
                <Icons.add className="mr-2 h-4 w-4" />
                Añadir Gasto
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
