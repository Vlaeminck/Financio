'use client';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { format, subMonths, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';

type MonthlySheetHeaderProps = {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  dolarCripto?: number;
  dolarBlue?: number;
  dolarOficial?: number;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(value);
};

export function MonthlySheetHeader({
  currentDate,
  setCurrentDate,
  dolarCripto,
  dolarBlue,
  dolarOficial
}: MonthlySheetHeaderProps) {

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handlePrevMonth}>
          <Icons.chevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight uppercase">
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </h1>
        <Button variant="outline" size="icon" onClick={handleNextMonth}>
          <Icons.chevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="hidden md:flex items-center gap-4 text-sm">
        {dolarCripto && (
            <div className="text-right">
                <span className="font-bold">CRIPTO</span> <span className="font-mono">{formatCurrency(dolarCripto)}</span>
            </div>
        )}
        {dolarBlue && (
            <div className="text-right">
                <span className="font-bold">BLUE</span> <span className="font-mono">{formatCurrency(dolarBlue)}</span>
            </div>
        )}
        {dolarOficial && (
            <div className="text-right">
                <span className="font-bold">OFICIAL</span> <span className="font-mono">{formatCurrency(dolarOficial)}</span>
            </div>
        )}
      </div>
    </div>
  );
}
