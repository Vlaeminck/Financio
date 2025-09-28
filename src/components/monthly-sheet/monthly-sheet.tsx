
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { MonthlySheetHeader } from './monthly-sheet-header';
import { ExpensesTable } from './expenses-table';
import { IncomeTable } from './income-table';
import { CryptoTable } from './crypto-table';
import { SummarySection } from './summary-section';
import { TRANSACTIONS } from '@/lib/data';
import type { Transaction, CryptoHolding } from '@/lib/types';
import { format, getMonth, getYear } from 'date-fns';
import { getCoinPrices } from '@/lib/actions';

const initialCryptoHoldings: Omit<CryptoHolding, 'price' | 'valueUsd' | 'valueArs'>[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', quantity: 0.12 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', quantity: 2.5 },
];

export function MonthlySheet() {
    const [allTransactions, setAllTransactions] = useState<Transaction[]>(TRANSACTIONS);
    const [currentDate, setCurrentDate] = useState(new Date('2024-10-01'));
    const [cryptoHoldings, setCryptoHoldings] = useState<CryptoHolding[]>([]);

    const updateCryptoPrices = useCallback(async (holdingsToUpdate: Omit<CryptoHolding, 'price' | 'valueUsd' | 'valueArs'>[]) => {
        const ids = holdingsToUpdate.map(h => h.id);
        const prices = await getCoinPrices(ids);
        // This is a placeholder, in a real app you'd get this from an API
        const arsRate = 1000; 

        const updatedHoldings = holdingsToUpdate.map(holding => {
            const price = prices[holding.id]?.usd || 0;
            const valueUsd = price * holding.quantity;
            const valueArs = valueUsd * arsRate;
            return {
                ...holding,
                price,
                valueUsd,
                valueArs
            };
        });
        setCryptoHoldings(updatedHoldings);
    }, []);

    useEffect(() => {
        updateCryptoPrices(initialCryptoHoldings);
    }, [updateCryptoPrices]);
    
    useEffect(() => {
        if (cryptoHoldings.length > 0) {
            const interval = setInterval(() => {
                updateCryptoPrices(cryptoHoldings);
            }, 60000); // refresh every minute
            return () => clearInterval(interval);
        }
    }, [cryptoHoldings, updateCryptoPrices]);

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
    
    const handleAddCryptoHolding = (coin: { id: string; name: string; symbol: string }, quantity: number) => {
        const existingHolding = cryptoHoldings.find(h => h.id === coin.id);
        let newHoldings;
        if (existingHolding) {
            newHoldings = cryptoHoldings.map(h => h.id === coin.id ? { ...h, quantity: h.quantity + quantity } : h);
        } else {
            const newHolding = {
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol.toUpperCase(),
                quantity: quantity,
                price: 0,
                valueUsd: 0,
                valueArs: 0,
            };
            newHoldings = [...cryptoHoldings, newHolding];
        }
        updateCryptoPrices(newHoldings);
    };

    const handleRemoveCryptoHolding = (id: string) => {
        const newHoldings = cryptoHoldings.filter(h => h.id !== id);
        setCryptoHoldings(newHoldings);
    };

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
                    <CryptoTable 
                        holdings={cryptoHoldings} 
                        onAddHolding={handleAddCryptoHolding}
                        onRemoveHolding={handleRemoveCryptoHolding}
                    />
                </div>
            </div>
        </div>
    );
}
