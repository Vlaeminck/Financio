import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Transaction } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type RecentTransactionsProps = {
  transactions: Transaction[];
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
    const recent = transactions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transacciones Recientes</CardTitle>
        <CardDescription>
          Un vistazo rápido a tus últimas actividades financieras.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="text-right">Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">{transaction.category}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={transaction.type === 'income' ? 'default' : 'secondary'}
                    className={cn(transaction.type === 'income' && 'bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/30', transaction.type === 'expense' && 'bg-red-500/20 text-red-700 hover:bg-red-500/30')}
                  >
                    {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                  </Badge>
                </TableCell>
                <TableCell className={cn(
                    "text-right font-medium",
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                )}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(transaction.amount)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">{format(transaction.date, 'd MMM', { locale: es })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
