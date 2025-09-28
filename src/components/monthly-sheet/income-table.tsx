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

type IncomeTableProps = {
  incomes: Transaction[];
};

const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(value);
};

const formatUsd = (value: number | undefined) => {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
}

export function IncomeTable({ incomes }: IncomeTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="bg-green-600 text-white -m-6 p-4 rounded-t-lg">INGRESOS</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>INGRESOS</TableHead>
              <TableHead className="text-right">VALOR</TableHead>
              <TableHead className="text-right">VALOR EN USD</TableHead>
              <TableHead className="text-right">PRECIO USD</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomes.map((income) => (
              <TableRow key={income.id}>
                <TableCell className="font-medium">{income.description}</TableCell>
                <TableCell className="text-right">{formatCurrency(income.amount)}</TableCell>
                <TableCell className="text-right">{formatUsd(income.valueUsd)}</TableCell>
                <TableCell className="text-right">{formatUsd(income.priceUsd)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
