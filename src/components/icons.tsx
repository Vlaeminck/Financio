import {
  Landmark,
  type LucideIcon,
  LayoutDashboard,
  ArrowRightLeft,
  Target,
  LineChart,
  Settings,
  ShoppingCart,
  Car,
  Home,
  HeartPulse,
  Ticket,
  GraduationCap,
  Utensils,
  Fuel,
  Gift,
  Plus,
  MoreHorizontal,
  FileText,
  DollarSign,
  Banknote,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  CircleHelp,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sheet as SheetIcon,
  Bitcoin,
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  logo: Landmark,
  dashboard: SheetIcon,
  transactions: ArrowRightLeft,
  budgets: Target,
  reports: LineChart,
  settings: Settings,
  add: Plus,
  more: MoreHorizontal,
  report: FileText,
  dollar: DollarSign,
  income: Banknote,
  savings: PiggyBank,
  expense: TrendingDown,
  growth: TrendingUp,
  help: CircleHelp,
  ai: Sparkles,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  crypto: Bitcoin,

  // Categories
  groceries: ShoppingCart,
  transportation: Car,
  housing: Home,
  healthcare: HeartPulse,
  entertainment: Ticket,
  education: GraduationCap,
  food: Utensils,
  utilities: Fuel,
  gifts: Gift,
  other: (props) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  ),
};

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Icons.logo className="h-6 w-6 text-primary" />
      <h1 className="text-xl font-bold text-primary">Financio</h1>
    </div>
  );
}
