
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { seedData, deleteAllData } from '@/lib/actions';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCryptoEnabled, setIsCryptoEnabled] = useState(false);

  useEffect(() => {
    const cryptoEnabled = localStorage.getItem('cryptoEnabled') === 'true';
    setIsCryptoEnabled(cryptoEnabled);
  }, []);

  const handleCryptoToggle = (enabled: boolean) => {
    setIsCryptoEnabled(enabled);
    localStorage.setItem('cryptoEnabled', String(enabled));
    toast({
      title: 'Configuración guardada',
      description: `El seguimiento de criptomonedas ha sido ${enabled ? 'habilitado' : 'deshabilitado'}.`,
    });
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      await seedData();
      toast({
        title: '¡Datos Sembreados!',
        description: 'La base de datos ha sido poblada con datos de prueba.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al Sembrar',
        description: 'No se pudieron sembrar los datos de prueba.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleDeleteAllData = async () => {
    setIsDeleting(true);
    try {
      await deleteAllData();
      toast({
        title: '¡Datos Eliminados!',
        description: 'Todas las transacciones han sido eliminadas de la base de datos.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al Eliminar',
        description: 'No se pudieron eliminar las transacciones.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona los datos y las funcionalidades de tu aplicación.
        </p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Funcionalidades</CardTitle>
          <CardDescription>
            Activa o desactiva las diferentes secciones de la aplicación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="crypto-toggle"
              checked={isCryptoEnabled}
              onCheckedChange={handleCryptoToggle}
            />
            <Label htmlFor="crypto-toggle">Habilitar seguimiento de Criptomonedas</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datos de Prueba</CardTitle>
          <CardDescription>
            Usa esta opción para poblar tu base de datos con un conjunto de transacciones de ejemplo. Esto es útil para probar la aplicación.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={isSeeding}>
                {isSeeding ? 'Sembrando...' : 'Sembrar Datos de Prueba'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción añadirá un conjunto de transacciones de prueba a tu base de datos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleSeedData}>Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Zona de Peligro</CardTitle>
          <CardDescription>
            Las acciones a continuación son irreversibles. Por favor, úsalas con precaución.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                {isDeleting ? 'Eliminando...' : 'Eliminar Todas las Transacciones'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción es irreversible. Se eliminarán todas las transacciones de tu base de datos permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={handleDeleteAllData}
                >
                  Sí, eliminar todo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
