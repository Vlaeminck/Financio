import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { CryptoHolding, FearAndGreed } from '@/lib/types';
import { CryptoSearch } from './crypto-search';
import { cn } from '@/lib/utils';

type CryptoTableProps = {
  holdings: CryptoHolding[];
  fearAndGreed: FearAndGreed | null;
  onAddHolding: (coin: { id: string; name: string; symbol: string }, quantity: number) => void;
  onRemoveHolding: (id: string) => void;
};

const formatCurrency = (value: number, currency = 'ARS') => {
    return new Intl.NumberFormat(currency === 'ARS' ? 'es-AR' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(value);
};

const SummaryBox = ({ title, value, bgColor = 'bg-gray-200', textColor = 'text-black', valueClassName }: { title: string; value: string; bgColor?: string; textColor?: string; valueClassName?: string; }) => (
    <div className={`p-2 flex justify-between items-center ${bgColor} ${textColor} text-sm`}>
        <span className="font-bold">{title}</span>
        <span className={`font-mono ${valueClassName}`}>{value}</span>
    </div>
);

const getFngIndicatorColor = (value: number): string => {
  if (value <= 25) return 'bg-red-500 text-white'; // Extreme Fear
  if (value > 25 && value <= 45) return 'bg-orange-500 text-white'; // Fear
  if (value > 45 && value <= 55) return 'bg-yellow-400 text-black'; // Neutral
  if (value > 55 && value <= 75) return 'bg-green-400 text-black'; // Greed
  return 'bg-green-600 text-white'; // Extreme Greed
};

export function CryptoTable({ holdings, fearAndGreed, onAddHolding, onRemoveHolding }: CryptoTableProps) {
  const totalCryptoUsd = holdings.reduce((sum, h) => sum + h.valueUsd, 0);
  const totalCryptoArs = holdings.reduce((sum, h) => sum + h.valueArs, 0);

  const fngValue = fearAndGreed ? parseInt(fearAndGreed.value, 10) : null;
  const fngColorClass = fngValue !== null ? getFngIndicatorColor(fngValue) : 'bg-gray-300';


  return (
    <Card>
      <CardHeader className="p-0">
        <CardTitle className="bg-purple-600 text-white m-0 p-2 rounded-t-lg text-base">CRIPTO</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <CryptoSearch onAddHolding={onAddHolding} />
        <Table>
          <TableBody>
            {holdings.map((holding) => (
              <TableRow key={holding.id}>
                <TableCell className="font-medium p-2">{holding.name}</TableCell>
                <TableCell className="text-right p-2">{holding.quantity}</TableCell>
                <TableCell className="text-right p-2">{formatCurrency(holding.price, 'USD')}</TableCell>
                <TableCell className="text-right p-2">{formatCurrency(holding.valueUsd, 'USD')}</TableCell>
                <TableCell className="text-right p-2">{formatCurrency(holding.valueArs, 'ARS')}</TableCell>
                 <TableCell className="p-1 w-10 text-center align-middle">
                  <button onClick={() => onRemoveHolding(holding.id)} className="text-red-500 hover:text-red-700">
                    X
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex-col p-0">
        <div className="p-2 flex justify-between items-center bg-green-200 text-sm w-full">
            <span className="font-bold">MIEDO Y CODICIA</span>
            <span className={cn("font-bold px-2 rounded-full", fngColorClass)}>
                {fngValue ?? '--'}
            </span>
        </div>
        <SummaryBox title="TOTAL CRIPTO" value={formatCurrency(totalCryptoUsd, 'USD')} bgColor="bg-purple-300 w-full"/>
        <SummaryBox title="TOTAL EN PESOS" value={formatCurrency(totalCryptoArs, 'ARS')} bgColor="bg-green-200 w-full"/>
      </CardFooter>
    </Card>
  );
}
