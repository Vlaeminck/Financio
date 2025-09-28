
'use client';

import { useState } from 'react';
import { MonthlySheetHeader } from './monthly-sheet-header';
import { ExpensesTable } from './expenses-table';
import { IncomeTable } from './income-table';
import { CryptoTable } from './crypto-table';
import { SummarySection } from './summary-section';
import { TRANSACTIONS, CRYPTO_HOLDINGS } from '@/lib/data';
import type { Transaction } from '@/lib/types';

export function MonthlySheet() {
    const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS);

    const expenses = transactions.filter(t => t.type === 'expense');
    const incomes = transactions.filter(t => t.type === 'income');

    // This is a placeholder function. In a real app, this would be much more robust.
    const handleUpdateTransactions = (updatedTransaction: Transaction) => {
        setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    }
    
    const handleAddTransaction = (newTransaction: Transaction) => {
        setTransactions(prev => [...prev, newTransaction]);
    }


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
            <SummarySection transactions={transactions} cryptoHoldings={CRYPTO_HOLDINGS} />
        </div>
    );
}
