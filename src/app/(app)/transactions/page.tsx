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
import { TransactionSheet } from '@/components/transaction-sheet';
import { TRANSACTIONS, CATEGORIES } from '@/lib/data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Icons } from '@/components/icons';

export default function TransactionsPage() {
  const categoryIconMap = CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = cat.icon;
    return acc;
  }, {} as Record<string, React.ElementType>);

  const sortedTransactions = [...TRANSACTIONS].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Transacciones</h1>
          <p className="text-muted-foreground">
            Un historial detallado de tus ingresos y gastos.
          </p>
        </div>
        <TransactionSheet />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Todas las Transacciones</CardTitle>
          <CardDescription>
            Explora y gestiona todas tus actividades financieras registradas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.map((transaction) => {
                const Icon = categoryIconMap[transaction.category] || Icons.other;
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                           <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                           <div className="font-medium">{transaction.description}</div>
                           <div className="text-sm text-muted-foreground">{transaction.category}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={transaction.type === 'income' ? 'default' : 'secondary'}
                        className={cn(transaction.type === 'income' && 'bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/30', transaction.type === 'expense' && 'bg-red-500/20 text-red-700 hover:bg-red-500/30')}
                      >
                        {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(transaction.date, 'd MMM, yyyy', { locale: es })}
                    </TableCell>
                    <TableCell className={cn(
                        "text-right font-medium",
                        transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                    )}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(transaction.amount)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
