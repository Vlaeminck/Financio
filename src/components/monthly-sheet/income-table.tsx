'use client';

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
import { cn } from '@/lib/utils';

type IncomeTableProps = {
  incomes: Transaction[];
  onIncomeChange: (income: Transaction) => void;
  onAddIncome: () => void;
};

export function IncomeTable({ incomes, onIncomeChange, onAddIncome }: IncomeTableProps) {
  
  const handleInputChange = (id: string, field: keyof Transaction, value: any) => {
    const income = incomes.find(inc => inc.id === id);
    if (income) {
      onIncomeChange({ ...income, [field]: value });
    }
  };

  return (
    <Card>
      <CardHeader className="p-0">
        <CardTitle className="bg-purple-600 text-primary-foreground m-0 p-2 rounded-t-lg text-base">INGRESOS</CardTitle>
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
            <Button onClick={onAddIncome} size="sm" className="w-full bg-green-800 hover:bg-green-900 text-white font-bold">
                <Icons.add className="mr-2 h-4 w-4" />
                Añadir Ingreso
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
