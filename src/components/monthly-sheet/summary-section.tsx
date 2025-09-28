import { Card, CardContent } from '@/components/ui/card';
import type { Transaction } from '@/lib/types';

type SummarySectionProps = {
  transactions: Transaction[];
  arsRate: number;
};

const formatCurrency = (value: number, currency: 'ARS' | 'USD', showNegativeSign = true) => {
    const formatted = new Intl.NumberFormat(currency === 'ARS' ? 'es-AR' : 'en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Math.abs(value));

    if (showNegativeSign && value < 0) {
        return `-${formatted}`;
    }
    return formatted;
}

const SummaryBox = ({ title, value, bgColor = 'bg-gray-200', textColor = 'text-black' }: { title: string; value: string; bgColor?: string; textColor?: string; }) => (
    <div className={`p-2 flex justify-between items-center ${bgColor} ${textColor} text-sm rounded-md`}>
        <span className="font-bold">{title}</span>
        <span className="font-mono">{value}</span>
    </div>
);

export function SummarySection({ transactions, arsRate }: SummarySectionProps) {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const fixedExpense = transactions.filter(t => t.amount > 0 && t.paid !== undefined).reduce((sum, t) => sum + t.amount, 0);

  const remainingPesos = totalIncome - totalExpense;
  const remainingUsd = arsRate > 0 ? remainingPesos / arsRate : 0;

  return (
    <div className="space-y-2">
        <SummaryBox title="GASTO FIJO" value={formatCurrency(fixedExpense, 'ARS', false)} bgColor="bg-green-200"/>
        <SummaryBox title="GASTO GENERAL" value={formatCurrency(totalExpense, 'ARS', false)} bgColor="bg-green-200"/>
        <SummaryBox title="EN DIGITAL" value={formatCurrency(1502733.00, 'ARS', false)} bgColor="bg-transparent text-foreground"/>
        <SummaryBox title="RESTANTE PESOS" value={formatCurrency(remainingPesos, 'ARS')} bgColor="bg-yellow-300"/>
        <SummaryBox title="RESTANTE USD" value={formatCurrency(remainingUsd, 'USD')} bgColor="bg-blue-400" textColor="text-white"/>
    </div>
  );
}
