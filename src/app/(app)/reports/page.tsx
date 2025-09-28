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
          <h1 className="text-3xl font-bold tracking-tight font-headline">Reports</h1>
          <p className="text-muted-foreground">
            Analyze your financial performance over time.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Detailed monthly and yearly reports will be available here soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 text-center min-h-60">
            <Icons.report className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">
                We are working hard to bring you insightful financial reports.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
