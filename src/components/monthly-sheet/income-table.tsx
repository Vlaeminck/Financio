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

export function IncomeTable({ incomes }: IncomeTableProps) {
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
                <TableCell className="font-medium px-2 py-1">{income.description}</TableCell>
                <TableCell className="text-right px-2 py-1">{formatCurrency(income.amount)}</TableCell>
                <TableCell className="text-right px-2 py-1">{formatUsd(income.valueUsd)}</TableCell>
                <TableCell className="text-right px-2 py-1">{formatUsd(income.priceUsd)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
