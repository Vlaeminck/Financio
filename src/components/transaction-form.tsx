'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CATEGORIES } from '@/lib/data';
import { suggestCategory } from '@/lib/actions';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Icons } from './icons';
import { Textarea } from '@/components/ui/textarea';


const formSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive('El monto debe ser positivo.'),
  date: z.date(),
  description: z.string().min(2, {
    message: 'La descripción debe tener al menos 2 caracteres.',
  }),
  category: z.string().min(1, 'La categoría es requerida.'),
});

type TransactionFormProps = {
  setSheetOpen: (open: boolean) => void;
};

export function TransactionForm({ setSheetOpen }: TransactionFormProps) {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'expense',
      amount: 0,
      date: new Date(),
      description: '',
      category: '',
    },
  });

  const watchType = form.watch('type');

  async function handleSuggestCategory() {
    const description = form.getValues('description');
    if (!description) {
      form.setError('description', { message: 'Por favor, introduce una descripción primero.' });
      return;
    }
    setIsSuggesting(true);
    const result = await suggestCategory(description);
    if (result.category) {
      const categoryExists = CATEGORIES.some(c => c.value === result.category);
      if (categoryExists) {
        form.setValue('category', result.category, { shouldValidate: true });
        toast({ title: '¡Categoría Sugerida!', description: `Hemos establecido la categoría como "${result.category}".` });
      } else {
        form.setValue('category', 'Otros', { shouldValidate: true });
        toast({ title: 'Sugerencia Encontrada', description: `Sugerimos "${result.category}", pero no está en tu lista. La hemos establecido como "Otros".` });
      }
    } else if (result.error) {
      toast({ variant: 'destructive', title: 'Error en la Sugerencia', description: result.error });
    }
    setIsSuggesting(false);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const typeText = values.type === 'income' ? 'ingreso' : 'gasto';
    const amountText = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(values.amount);
    toast({
      title: '¡Transacción Guardada!',
      description: `Tu ${typeText} de ${amountText} ha sido registrado.`,
    });
    // In a real app, you would add the transaction to your state/database here.
    setSheetOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo de transacción" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="expense">Gasto</SelectItem>
                  <SelectItem value="income">Ingreso</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">€</span>
                  <Input type="number" placeholder="0.00" {...field} className="pl-8"/>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Ej: Café con un amigo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchType === 'expense' && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <div className="flex gap-2">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <div className="flex items-center gap-2">
                              <cat.icon className="h-4 w-4" />
                              {cat.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleSuggestCategory}
                      disabled={isSuggesting}
                      aria-label="Sugerir categoría con IA"
                    >
                      <Icons.ai className={cn("h-4 w-4", isSuggesting && "animate-spin")} />
                    </Button>
                  </div>
                   <FormDescription>
                    O deja que la IA sugiera una categoría según la descripción.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP', { locale: es })
                      ) : (
                        <span>Elige una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    locale={es}
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Guardar Transacción</Button>
      </form>
    </Form>
  );
}
