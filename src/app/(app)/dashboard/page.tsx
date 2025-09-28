import { MonthlySheet } from '@/components/monthly-sheet/monthly-sheet';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <MonthlySheet />
    </div>
  );
}
