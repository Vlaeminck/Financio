import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/icons';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Informes</h1>
          <p className="text-muted-foreground">
            Analiza tu rendimiento financiero a lo largo del tiempo.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Próximamente</CardTitle>
          <CardDescription>
            Informes mensuales y anuales detallados estarán disponibles aquí pronto.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 text-center min-h-60">
            <Icons.report className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">
                Estamos trabajando para ofrecerte informes financieros detallados.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
