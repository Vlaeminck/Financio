'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { format, subMonths, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';

export function MonthlySheetHeader() {
  const [currentDate, setCurrentDate] = useState(new Date('2024-10-01'));

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
    </div>
  );
}
