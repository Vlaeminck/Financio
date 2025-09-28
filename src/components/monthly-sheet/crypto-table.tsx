import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export function CryptoTable({ holdings }: CryptoTableProps) {
  return (
    <Card>
      <CardHeader className="p-0">
        <CardTitle className="bg-blue-600 text-white m-0 p-2 rounded-t-lg text-base">CRIPTO</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {holdings.map((holding) => (
              <TableRow key={holding.id}>
                <TableCell className="font-medium px-2 py-1">{holding.name}</TableCell>
                <TableCell className="text-right px-2 py-1">{holding.quantity}</TableCell>
                <TableCell className="text-right px-2 py-1">{formatCurrency(holding.price, 'USD')}</TableCell>
                <TableCell className="text-right px-2 py-1">{formatCurrency(holding.valueUsd, 'USD')}</TableCell>
                <TableCell className="text-right px-2 py-1">{formatCurrency(holding.valueArs, 'ARS')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
