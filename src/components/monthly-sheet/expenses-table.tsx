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

type ExpensesTableProps = {
  expenses: Transaction[];
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
};

export function ExpensesTable({ expenses }: ExpensesTableProps) {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="bg-blue-600 text-white -m-6 p-4 rounded-t-lg">GASTOS</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">GASTOS</TableHead>
              <TableHead className="text-right">VALOR</TableHead>
              <TableHead>NOTAS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.category}</TableCell>
                <TableCell className={cn("text-right font-medium text-white", expense.amount > 0 ? 'bg-red-500' : 'bg-transparent')}>
                  {formatCurrency(expense.amount)}
                </TableCell>
                <TableCell>{expense.notes}</TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold bg-green-200">
                <TableCell>GASTO GENERAL</TableCell>
                <TableCell className="text-right">${formatCurrency(totalExpenses)}</TableCell>
                <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
