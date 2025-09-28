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
          <h1 className="text-3xl font-bold tracking-tight font-headline">Transactions</h1>
          <p className="text-muted-foreground">
            A detailed history of your income and expenses.
          </p>
        </div>
        <TransactionSheet />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            Browse and manage all your logged financial activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
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
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(transaction.date, 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className={cn(
                        "text-right font-medium",
                        transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                    )}>
                      {transaction.type === 'income' ? '+' : '-'}
                      ${transaction.amount.toFixed(2)}
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
