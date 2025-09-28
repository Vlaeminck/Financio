
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

type IncomeTableProps = {
  incomes: Transaction[];
  onIncomeChange: (income: Transaction) => void;
  onAddIncome: (newIncome: { description: string; amount: number }) => void;
};

function AddIncomeForm({ onAddIncome }: { onAddIncome: IncomeTableProps['onAddIncome'] }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    const numericAmount = parseFloat(amount);
    if (description && !isNaN(numericAmount)) {
      onAddIncome({ description, amount: numericAmount });
      setDescription('');
      setAmount('');
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" className="w-full bg-green-800 hover:bg-green-900 text-white font-bold">
          <Icons.add className="mr-2 h-4 w-4" />
          Añadir Ingreso
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Añadir Nuevo Ingreso</h4>
          <p className="text-sm text-muted-foreground">
            Introduce los detalles de tu nuevo ingreso.
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="income-description">Nombre</Label>
            <Input
              id="income-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Salario"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="income-amount">Monto</Label>
            <Input
              id="income-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </div>
          <Button onClick={handleAdd}>Añadir</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}


export function IncomeTable({ incomes, onIncomeChange, onAddIncome }: IncomeTableProps) {
  
  const handleInputChange = (id: string, field: keyof Transaction, value: any) => {
    const income = incomes.find(inc => inc.id === id);
    if (income) {
      onIncomeCode.ts
change({ ...income, [field]: value });
    }
  };

  return (
    <Card>
      <CardHeader className="p-0">
        <CardTitle className="bg-primary text-primary-foreground m-0 p-2 rounded-t-lg text-base">INGRESOS</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {incomes.map((income) => (
              <TableRow key={income.id} className="border-b-0">
                <TableCell className="font-medium p-0">
                   <Input
                    type="text"
                    value={income.description}
                    onChange={(e) => handleInputChange(income.id, 'description', e.target.value)}
                    className="h-auto py-1 px-2 text-sm bg-transparent border-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 rounded-none w-full"
                  />
                </TableCell>
                <TableCell className="text-right p-0 w-[120px]">
                   <Input
                    type="number"
                    value={income.amount}
                    onChange={(e) => handleInputChange(income.id, 'amount', parseFloat(e.target.value) || 0)}
                    className="h-auto py-1 px-2 text-sm bg-transparent border-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 text-right rounded-none w-full"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-2">
            <AddIncomeForm onAddIncome={onAddIncome} />
        </div>
      </CardContent>
    </Card>
  );
}
