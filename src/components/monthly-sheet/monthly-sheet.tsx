
'use client';

import { useState, useMemo } from 'react';
import { MonthlySheetHeader } from './monthly-sheet-header';
import { ExpensesTable } from './expenses-table';
import { IncomeTable } from './income-table';
import { CryptoTable } from './crypto-table';
import { SummarySection } from './summary-section';
import { TRANSACTIONS, CRYPTO_HOLDINGS } from '@/lib/data';
import type { Transaction } from '@/lib/types';
import { format, getMonth, getYear } from 'date-fns';

export function MonthlySheet() {
    const [allTransactions, setAllTransactions] = useState<Transaction[]>(TRANSACTIONS);
    const [currentDate, setCurrentDate] = useState(new Date('2024-10-01'));

    const filteredTransactions = useMemo(() => {
        return allTransactions.filter(t => 
            getYear(t.date) === getYear(currentDate) && 
            getMonth(t.date) === getMonth(currentDate)
        );
    }, [allTransactions, currentDate]);

    const expenses = useMemo(() => filteredTransactions.filter(t => t.type === 'expense'), [filteredTransactions]);
    const incomes = useMemo(() => filteredTransactions.filter(t => t.type === 'income'), [filteredTransactions]);
    
    const handleTransactionChange = (updatedTransaction: Transaction) => {
        setAllTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    }
    
    const handleAddTransaction = (type: 'income' | 'expense') => {
        const newTransaction: Transaction = {
          id: `${type}-${Date.now()}`,
          date: new Date(currentDate),
          description: '',
          amount: 0,
          type: type,
          category: type === 'expense' ? 'Otros' : 'Ingresos',
          notes: '',
          paid: type === 'expense' ? false : undefined,
        };
        setAllTransactions(prev => [...prev, newTransaction]);
    }

    return (
        <div className="space-y-4">
            <MonthlySheetHeader currentDate={currentDate} setCurrentDate={setCurrentDate} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1 space-y-4">
                    <ExpensesTable 
                        expenses={expenses}
                        onExpenseChange={handleTransactionChange}
                        onAddExpense={() => handleAddTransaction('expense')}
                    />
                </div>
                <div className="lg:col-span-1 space-y-4">
                    <IncomeTable 
                        incomes={incomes}
                        onIncomeChange={handleTransactionChange}
                        onAddIncome={() => handleAddTransaction('income')}
                    />
                    <SummarySection transactions={filteredTransactions} />
                </div>
                <div className="lg:col-span-1 space-y-4">
                    <CryptoTable holdings={CRYPTO_HOLDINGS} />
                </div>
            </div>
        </div>
    );
}
