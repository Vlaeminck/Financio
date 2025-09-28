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
      <CardHeader>
        <CardTitle className="bg-blue-600 text-white -m-6 p-4 rounded-t-lg">CRIPTO</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CRIPTO</TableHead>
              <TableHead className="text-right">CANTIDAD</TableHead>
              <TableHead className="text-right">PRECIO</TableHead>
              <TableHead className="text-right">VALOR EN USD</TableHead>
              <TableHead className="text-right">VALOR EN ARS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings.map((holding) => (
              <TableRow key={holding.id}>
                <TableCell className="font-medium">{holding.name}</TableCell>
                <TableCell className="text-right">{holding.quantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(holding.price, 'USD')}</TableCell>
                <TableCell className="text-right">{formatCurrency(holding.valueUsd, 'USD')}</TableCell>
                <TableCell className="text-right">{formatCurrency(holding.valueArs, 'ARS')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
