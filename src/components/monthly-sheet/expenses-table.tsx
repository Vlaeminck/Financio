'use client';

import { useState } from 'react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

type ExpensesTableProps = {
  expenses: Transaction[];
  onExpenseChange: (expense: Transaction) => void;
  onAddExpense: (newExpense: Omit<Transaction, 'id' | 'date' | 'type' | 'category' | 'description'> & { description: string }) => void;
  onRemoveExpense: (id: string) => void;
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
};

function AddExpenseForm({ onAddExpense }: { onAddExpense: ExpensesTableProps['onAddExpense'] }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paid, setPaid] = useState(false);
  const [digital, setDigital] = useState(false);
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    const numericAmount = parseFloat(amount);
    if (description && !isNaN(numericAmount)) {
      onAddExpense({
        description,
        amount: numericAmount,
        notes: '',
        paid,
        digital,
      });
      setDescription('');
      setAmount('');
      setPaid(false);
      setDigital(false);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" className="w-full bg-green-800 hover:bg-green-900 text-white font-bold">
          <Icons.add className="mr-2 h-4 w-4" />
          Añadir Gasto
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Añadir Nuevo Gasto</h4>
          <p className="text-sm text-muted-foreground">
            Introduce los detalles de tu nuevo gasto.
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Nombre</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Supermercado"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="paid" checked={paid} onCheckedChange={(checked) => setPaid(!!checked)} />
            <Label htmlFor="paid">¿Está Pagado?</Label>
          </div>
           <div className="flex items-center space-x-2">
            <Checkbox id="digital" checked={digital} onCheckedChange={(checked) => setDigital(!!checked)} />
            <Label htmlFor="digital">¿Es Digital?</Label>
          </div>
          <Button onClick={handleAdd}>Añadir</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}


export function ExpensesTable({ expenses, onExpenseChange, onAddExpense, onRemoveExpense }: ExpensesTableProps) {
  
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
                    value={expense.description}
                    onChange={(e) => handleInputChange(expense.id, 'description', e.target.value)}
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
                 <TableCell className="p-1 w-10 text-center align-middle">
                  <button onClick={() => onRemoveExpense(expense.id)} className="text-red-500 hover:text-red-700 font-bold">
                    X
                  </button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold bg-green-200 border-b-0">
                <TableCell className="p-2">GASTO GENERAL</TableCell>
                <TableCell className="text-right p-2" colSpan={4}>{formatCurrency(totalExpenses)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="p-2">
            <AddExpenseForm onAddExpense={onAddExpense} />
        </div>
      </CardContent>
    </Card>
  );
}
