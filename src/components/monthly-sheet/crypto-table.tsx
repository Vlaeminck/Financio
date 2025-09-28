import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { CryptoHolding } from '@/lib/types';

type CryptoTableProps = {
  holdings: CryptoHolding[];
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


export function CryptoTable({ holdings }: CryptoTableProps) {
  const totalCryptoUsd = holdings.reduce((sum, h) => sum + h.valueUsd, 0);
  const totalCryptoArs = holdings.reduce((sum, h) => sum + h.valueArs, 0);

  return (
    <Card>
      <CardHeader className="p-0">
        <CardTitle className="bg-purple-600 text-white m-0 p-2 rounded-t-lg text-base">CRIPTO</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {holdings.map((holding) => (
              <TableRow key={holding.id}>
                <TableCell className="font-medium p-2">{holding.name}</TableCell>
                <TableCell className="text-right p-2">{holding.quantity}</TableCell>
                <TableCell className="text-right p-2">{formatCurrency(holding.price, 'USD')}</TableCell>
                <TableCell className="text-right p-2">{formatCurrency(holding.valueUsd, 'USD')}</TableCell>
                <TableCell className="text-right p-2">{formatCurrency(holding.valueArs, 'ARS')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex-col p-0">
        <div className="p-2 flex justify-between items-center bg-green-200 text-sm w-full">
            <span className="font-bold">MIEDO Y CODICIA</span>
            <span className="font-bold text-green-700 bg-green-300 px-2 rounded-full">37</span>
        </div>
        <SummaryBox title="TOTAL CRIPTO" value={formatCurrency(totalCryptoUsd, 'USD')} bgColor="bg-purple-300 w-full"/>
        <SummaryBox title="TOTAL EN PESOS" value={formatCurrency(totalCryptoArs, 'ARS')} bgColor="bg-green-200 w-full"/>
      </CardFooter>
    </Card>
  );
}
