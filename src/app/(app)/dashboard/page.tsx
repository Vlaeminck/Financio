import { SummaryCard } from '@/components/dashboard/summary-card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { SavingsProjectionChart } from '@/components/dashboard/savings-projection-chart';
import { Icons } from '@/components/icons';
import { TransactionSheet } from '@/components/transaction-sheet';
import { TRANSACTIONS } from '@/lib/data';

export default function DashboardPage() {
  const totalIncome = TRANSACTIONS.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = TRANSACTIONS.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Welcome Back!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s a summary of your financial activity.
          </p>
        </div>
        <TransactionSheet />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Total Income" 
          value={formatCurrency(totalIncome)} 
          icon={Icons.income}
          change="+15.2% from last month"
          changeType="positive"
        />
        <SummaryCard 
          title="Total Expenses" 
          value={formatCurrency(totalExpenses)} 
          icon={Icons.expense}
          change="+8.1% from last month"
          changeType="negative"
        />
        <SummaryCard 
          title="Balance" 
          value={formatCurrency(balance)} 
          icon={Icons.dollar}
        />
        <SummaryCard 
          title="Savings Goal" 
          value={formatCurrency(25000)} 
          icon={Icons.savings}
          change="75% of goal reached"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-1 lg:col-span-4">
          <RecentTransactions transactions={TRANSACTIONS} />
        </div>
        <div className="col-span-1 lg:col-span-3">
          <OverviewChart transactions={TRANSACTIONS} />
        </div>
      </div>
      
      <div className="grid gap-4">
        <SavingsProjectionChart transactions={TRANSACTIONS} />
      </div>
    </>
  );
}
