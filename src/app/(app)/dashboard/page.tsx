import { MonthlySheet } from '@/components/monthly-sheet/monthly-sheet';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <MonthlySheet />
    </div>
  );
}
