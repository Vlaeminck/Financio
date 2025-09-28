import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CATEGORIES } from '@/lib/data';
import type { Budget } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Icons } from '../icons';

export function BudgetCard({ budget }: { budget: Budget }) {
  const category = CATEGORIES.find((c) => c.value === budget.category);
  const Icon = category?.icon || Icons.other;
  const percentage = (budget.spent / budget.amount) * 100;
  const remaining = budget.amount - budget.spent;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  let progressColorClass = 'bg-primary';
  if (percentage > 90) {
    progressColorClass = 'bg-destructive';
  } else if (percentage > 75) {
    progressColorClass = 'bg-yellow-500';
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
                <Icon className="h-5 w-5 text-muted-foreground" />
                {budget.category}
            </CardTitle>
            <div className="text-lg font-bold">{formatCurrency(budget.amount)}</div>
        </div>
        <CardDescription>Monthly Budget</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={percentage} className="h-2" indicatorClassName={progressColorClass} />
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <span>Spent: {formatCurrency(budget.spent)}</span>
        <span className={cn(remaining < 0 && 'text-destructive font-semibold')}>
            {remaining >= 0 ? `${formatCurrency(remaining)} remaining` : `${formatCurrency(Math.abs(remaining))} over`}
        </span>
      </CardFooter>
    </Card>
  );
}
