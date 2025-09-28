import { MonthlySheetHeader } from './monthly-sheet-header';
import { ExpensesTable } from './expenses-table';
import { IncomeTable } from './income-table';
import { CryptoTable } from './crypto-table';
import { SummarySection } from './summary-section';
import { TRANSACTIONS, CRYPTO_HOLDINGS } from '@/lib/data';

export function MonthlySheet() {
    const expenses = TRANSACTIONS.filter(t => t.type === 'expense');
    const incomes = TRANSACTIONS.filter(t => t.type === 'income');

    return (
        <div className="space-y-4">
            <MonthlySheetHeader />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1 space-y-4">
                    <ExpensesTable expenses={expenses} />
                </div>
                <div className="lg:col-span-1 space-y-4">
                    <IncomeTable incomes={incomes} />
                </div>
                <div className="lg:col-span-1 space-y-4">
                    <CryptoTable holdings={CRYPTO_HOLDINGS} />
                </div>
            </div>
            <SummarySection transactions={TRANSACTIONS} cryptoHoldings={CRYPTO_HOLDINGS} />
        </div>
    );
}
