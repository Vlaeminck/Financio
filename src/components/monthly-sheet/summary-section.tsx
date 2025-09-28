import { Card, CardContent } from '@/components/ui/card';
import type { Transaction, CryptoHolding } from '@/lib/types';

type SummarySectionProps = {
  transactions: Transaction[];
  cryptoHoldings: CryptoHolding[];
};

const formatCurrency = (value: number, currency: 'ARS' | 'USD') => {
    return new Intl.NumberFormat(currency === 'ARS' ? 'es-AR' : 'en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

const SummaryBox = ({ title, value, bgColor = 'bg-gray-200', textColor = 'text-black', valueClassName }: { title: string; value: string; bgColor?: string; textColor?: string; valueClassName?: string; }) => (
    <div className={`p-2 flex justify-between items-center ${bgColor} ${textColor} text-sm`}>
        <span className="font-bold">{title}</span>
        <span className={`font-mono ${valueClassName}`}>{value}</span>
    </div>
);

export function SummarySection({ transactions, cryptoHoldings }: SummarySectionProps) {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const remainingPesos = totalIncome - totalExpense;
  // This is a placeholder, in a real app you'd get this from an API
  const usdRate = 1000;
  const remainingUsd = remainingPesos / usdRate;

  const totalCryptoUsd = cryptoHoldings.reduce((sum, h) => sum + h.valueUsd, 0);
  const totalCryptoArs = cryptoHoldings.reduce((sum, h) => sum + h.valueArs, 0);


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
            <CardContent className="p-0">
                <SummaryBox title="GASTO FIJO" value={formatCurrency(1772733.00, 'ARS')} bgColor="bg-green-200"/>
                <SummaryBox title="GASTO GENERAL" value={formatCurrency(totalExpense, 'ARS')} bgColor="bg-green-200"/>
                <div className="p-2 flex justify-between items-center text-sm">
                    <span className="font-bold">EN DIGITAL</span>
                    <span>{formatCurrency(1502733.00, 'ARS')}</span>
                </div>
            </CardContent>
        </Card>
        <Card className="lg:col-span-1">
             <CardContent className="p-0">
                <SummaryBox title="RESTANTE PESOS" value={formatCurrency(remainingPesos, 'ARS')} bgColor="bg-yellow-300"/>
                <SummaryBox title="RESTANTE USD" value={formatCurrency(remainingUsd, 'USD')} bgColor="bg-blue-400" textColor="text-white"/>
            </CardContent>
        </Card>
        <Card className="lg:col-span-1">
             <CardContent className="p-0">
                 <div className="p-2 flex justify-between items-center bg-green-200 text-sm">
                    <span className="font-bold">MIEDO Y CODICIA</span>
                    <span className="font-bold text-green-700 bg-green-300 px-2 rounded-full">37</span>
                </div>
                <SummaryBox title="TOTAL CRIPTO" value={formatCurrency(totalCryptoUsd, 'USD')} bgColor="bg-purple-300"/>
                <SummaryBox title="TOTAL EN PESOS" value={formatCurrency(totalCryptoArs, 'ARS')} bgColor="bg-green-200"/>
            </CardContent>
        </Card>
    </div>
  );
}
