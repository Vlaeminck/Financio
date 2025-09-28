'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import { TransactionForm } from './transaction-form';

export function TransactionSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Icons.add className="mr-2 h-4 w-4" />
          Nueva Transacción
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Añadir Transacción</SheetTitle>
          <SheetDescription>
            Registra un nuevo ingreso o gasto para controlar tus finanzas.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <TransactionForm setSheetOpen={setOpen} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
