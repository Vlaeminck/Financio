
import { Card, CardContent } from '@/components/ui/card';
import type { Transaction, DolarRates, DolarType } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


type SummarySectionProps = {
  transactions: Transaction[];
  arsRate: number;
  dolarRates: DolarRates;
  selectedDolarType: DolarType;
  setSelectedDolarType: (type: DolarType) => void;
  isCryptoEnabled: boolean;
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

export function SummarySection({ transactions, arsRate, dolarRates, selectedDolarType, setSelectedDolarType, isCryptoEnabled }: SummarySectionProps) {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const fixedExpense = transactions.filter(t => t.fixed).reduce((sum, t) => sum + t.amount, 0);
  const digitalExpense = transactions.filter(t => t.digital).reduce((sum, t) => sum + t.amount, 0);


  const remainingPesos = totalIncome - totalExpense;
  const remainingUsd = arsRate > 0 ? remainingPesos / arsRate : 0;

  const dolarTypeLabels: Record<DolarType, string> = {
    cripto: 'Cripto',
    blue: 'Blue',
    oficial: 'Oficial',
  };


  return (
    <div className="space-y-2">
        <SummaryBox title="GASTO FIJO" value={formatCurrency(fixedExpense, 'ARS', false)} bgColor="bg-green-200"/>
        <SummaryBox title="GASTO GENERAL" value={formatCurrency(totalExpense, 'ARS', false)} bgColor="bg-green-200"/>
        <SummaryBox title="EN DIGITAL" value={formatCurrency(digitalExpense, 'ARS', false)} bgColor="bg-transparent text-foreground"/>
        <SummaryBox title="RESTANTE PESOS" value={formatCurrency(remainingPesos, 'ARS')} bgColor="bg-yellow-300"/>
        <div className="flex items-center gap-2">
            <Select value={selectedDolarType} onValueChange={(value: DolarType) => setSelectedDolarType(value)}>
                <SelectTrigger className="w-[120px] bg-blue-400 text-white font-bold border-none">
                    <SelectValue placeholder="Tipo de Dólar" />
                </SelectTrigger>
                <SelectContent>
                    {isCryptoEnabled && <SelectItem value="cripto">Cripto</SelectItem>}
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="oficial">Oficial</SelectItem>
                </SelectContent>
            </Select>
            <div className="p-2 flex justify-between items-center bg-blue-400 text-white text-sm rounded-md flex-grow">
                <span className="font-bold">RESTANTE USD</span>
                <span className="font-mono">{formatCurrency(remainingUsd, 'USD')}</span>
            </div>
        </div>
    </div>
  );
}
