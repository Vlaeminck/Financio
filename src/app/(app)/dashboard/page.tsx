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
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            ¡Bienvenido de Nuevo!
          </h1>
          <p className="text-muted-foreground">
            Aquí tienes un resumen de tu actividad financiera.
          </p>
        </div>
        <TransactionSheet />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Ingresos Totales" 
          value={formatCurrency(totalIncome)} 
          icon={Icons.income}
          change="+15.2% desde el mes pasado"
          changeType="positive"
        />
        <SummaryCard 
          title="Gastos Totales" 
          value={formatCurrency(totalExpenses)} 
          icon={Icons.expense}
          change="+8.1% desde el mes pasado"
          changeType="negative"
        />
        <SummaryCard 
          title="Saldo" 
          value={formatCurrency(balance)} 
          icon={Icons.dollar}
        />
        <SummaryCard 
          title="Meta de Ahorro" 
          value={formatCurrency(25000)} 
          icon={Icons.savings}
          change="75% de la meta alcanzada"
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
