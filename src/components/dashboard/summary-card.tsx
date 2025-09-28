import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Icon } from '@/components/icons';
import { cn } from '@/lib/utils';

type SummaryCardProps = {
  title: string;
  value: string;
  icon: Icon;
  change?: string;
  changeType?: 'positive' | 'negative';
};

export function SummaryCard({ title, value, icon: Icon, change, changeType }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
           <p className={cn(
             "text-xs text-muted-foreground",
             changeType === 'positive' && "text-emerald-600",
             changeType === 'negative' && "text-red-600"
           )}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
