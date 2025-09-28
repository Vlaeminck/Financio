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
      <CardHeader className="p-0">
        <CardTitle className="bg-blue-600 text-white m-0 p-2 rounded-t-lg text-base">GASTOS</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2 px-2 py-1 h-auto text-xs">GASTOS</TableHead>
              <TableHead className="text-right px-2 py-1 h-auto text-xs">VALOR</TableHead>
              <TableHead className="px-2 py-1 h-auto text-xs">NOTAS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium px-2 py-1">{expense.category}</TableCell>
                <TableCell className={cn("text-right font-medium text-white px-2 py-1", expense.amount > 0 ? 'bg-red-500' : 'bg-transparent')}>
                  {formatCurrency(expense.amount)}
                </TableCell>
                <TableCell className="px-2 py-1">{expense.notes}</TableCell>
              </TableRow>
            ))}
            <TableRow className="font-bold bg-green-200">
                <TableCell className="px-2 py-1">GASTO GENERAL</TableCell>
                <TableCell className="text-right px-2 py-1">${formatCurrency(totalExpenses)}</TableCell>
                <TableCell className="px-2 py-1"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
