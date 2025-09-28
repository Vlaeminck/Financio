
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

type IncomeTableProps = {
  incomes: Transaction[];
};

const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
};

const formatUsd = (value: number | undefined) => {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
}

export function IncomeTable({ incomes: initialIncomes }: IncomeTableProps) {
  const [incomes, setIncomes] = useState(initialIncomes);

  const handleIncomeChange = (id: string, field: keyof Transaction, value: any) => {
    setIncomes(incomes.map(inc => inc.id === id ? { ...inc, [field]: value } : inc));
  };

  const addNewIncome = () => {
    const newIncome: Transaction = {
      id: `income-${Date.now()}`,
      date: new Date(),
      description: 'Nuevo Ingreso',
      amount: 0,
      type: 'income',
      category: 'Ingresos',
      valueUsd: 0,
      priceUsd: 0,
    };
    setIncomes([...incomes, newIncome]);
  };

  return (
    <Card>
      <CardHeader className="p-0">
        <CardTitle className="bg-green-600 text-white m-0 p-2 rounded-t-lg text-base">INGRESOS</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {incomes.map((income) => (
              <TableRow key={income.id}>
                <TableCell className="font-medium px-2 py-1 w-auto">
                   <Input
                    type="text"
                    value={income.description}
                    onChange={(e) => handleIncomeChange(income.id, 'description', e.target.value)}
                    className="h-7 p-1 text-sm bg-transparent border-none focus-visible:ring-1 focus-visible:ring-ring"
                    style={{width: `${(income.description.length || 15)}ch`}}
                  />
                </TableCell>
                <TableCell className="text-right px-2 py-1 w-auto">
                   <Input
                    type="number"
                    value={income.amount}
                    onChange={(e) => handleIncomeChange(income.id, 'amount', parseFloat(e.target.value) || 0)}
                    className="h-7 p-1 text-sm bg-transparent border-none focus-visible:ring-1 focus-visible:ring-ring text-right"
                     style={{width: `${(income.amount.toString().length || 8)}ch`}}
                  />
                </TableCell>
                <TableCell className="text-right px-2 py-1 w-auto">
                  <Input
                    type="number"
                    value={income.valueUsd}
                    onChange={(e) => handleIncomeChange(income.id, 'valueUsd', parseFloat(e.target.value) || 0)}
                    className="h-7 p-1 text-sm bg-transparent border-none focus-visible:ring-1 focus-visible:ring-ring text-right"
                    style={{width: `${(income.valueUsd?.toString().length || 8)}ch`}}
                  />
                </TableCell>
                <TableCell className="text-right px-2 py-1 w-auto">
                   <Input
                    type="number"
                    value={income.priceUsd}
                    onChange={(e) => handleIncomeChange(income.id, 'priceUsd', parseFloat(e.target.value) || 0)}
                    className="h-7 p-1 text-sm bg-transparent border-none focus-visible:ring-1 focus-visible:ring-ring text-right"
                    style={{width: `${(income.priceUsd?.toString().length || 8)}ch`}}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-2">
            <Button onClick={addNewIncome} size="sm" className="w-full">
                <Icons.add className="mr-2 h-4 w-4" />
                Añadir Ingreso
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
