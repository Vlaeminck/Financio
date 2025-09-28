import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { BudgetCard } from '@/components/budgets/budget-card';
import { BUDGETS } from '@/lib/data';

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Budgets</h1>
          <p className="text-muted-foreground">
            Set and track your spending limits for each category.
          </p>
        </div>
        <Button>
          <Icons.add className="mr-2 h-4 w-4" />
          New Budget
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {BUDGETS.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </div>
    </div>
  );
}
