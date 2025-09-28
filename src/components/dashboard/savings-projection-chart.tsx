'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useMemo } from 'react';
import type { Transaction } from '@/lib/types';
import { format } from 'date-fns';

type SavingsProjectionChartProps = {
  transactions: Transaction[];
};

export function SavingsProjectionChart({ transactions }: SavingsProjectionChartProps) {
  const { chartData, projectionEndValue } = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const currentBalance = totalIncome - totalExpense;
    const monthlyNet = (totalIncome - totalExpense) / 2; // Assuming data is for 2 months

    const data = [];
    for (let i = 0; i <= 12; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() + i);
        data.push({
            month: format(date, 'MMM'),
            savings: currentBalance + (monthlyNet * i),
        });
    }

    return { chartData: data, projectionEndValue: data[data.length - 1].savings };
  }, [transactions]);
  
  const formatCurrency = (value: number) =>
    `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Projection</CardTitle>
        <CardDescription>
          Your projected savings over the next 12 months based on current trends.
          Projected balance in 1 year: <span className="font-bold text-primary">{formatCurrency(projectionEndValue)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[200px] w-full">
          <AreaChart data={chartData}>
            <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatCurrency}/>
            <ChartTooltip cursor={true} content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)}/>} />
            <Area
              dataKey="savings"
              type="natural"
              fill="url(#colorSavings)"
              stroke="hsl(var(--primary))"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
