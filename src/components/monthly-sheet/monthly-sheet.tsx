
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { MonthlySheetHeader } from './monthly-sheet-header';
import { ExpensesTable } from './expenses-table';
import { IncomeTable } from './income-table';
import { CryptoTable } from './crypto-table';
import { SummarySection } from './summary-section';
import { TRANSACTIONS } from '@/lib/data';
import type { Transaction, CryptoHolding } from '@/lib/types';
import { getMonth, getYear } from 'date-fns';
import { getCoinPrices, getDolarCriptoRate } from '@/lib/actions';

const initialCryptoHoldings: Omit<CryptoHolding, 'price' | 'valueUsd' | 'valueArs'>[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', quantity: 0.12 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', quantity: 2.5 },
];

export function MonthlySheet() {
    const [allTransactions, setAllTransactions] = useState<Transaction[]>(TRANSACTIONS);
    const [currentDate, setCurrentDate] = useState<Date | null>(null);
    const [cryptoHoldings, setCryptoHoldings] = useState<CryptoHolding[]>([]);
    const [arsRate, setArsRate] = useState(1000);

    useEffect(() => {
        // Set initial date on client to avoid hydration mismatch
        if (!currentDate) {
          setCurrentDate(new Date('2024-09-01T00:00:00Z'));
        }
    }, [currentDate]);

    const updateDolarRate = useCallback(async () => {
        const rate = await getDolarCriptoRate();
        if (rate) {
            setArsRate(rate);
        }
    }, []);

    const updateCryptoPrices = useCallback(async (holdingsToUpdate: Omit<CryptoHolding, 'price' | 'valueUsd' | 'valueArs'>[], currentArsRate: number) => {
        const ids = holdingsToUpdate.map(h => h.id);
        if (ids.length === 0) {
            setCryptoHoldings([]);
            return;
        };
        const prices = await getCoinPrices(ids);
        
        const updatedHoldings = holdingsToUpdate.map(holding => {
            const price = prices[holding.id]?.usd || 0;
            const valueUsd = price * holding.quantity;
            const valueArs = valueUsd * currentArsRate;
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
        updateDolarRate();
        const rateInterval = setInterval(updateDolarRate, 3600000); // refresh every hour
        return () => clearInterval(rateInterval);
    }, [updateDolarRate]);

    useEffect(() => {
        const initialHoldings = initialCryptoHoldings.map(h => ({...h, price:0, valueUsd: 0, valueArs: 0}));
        if(cryptoHoldings.length === 0 && typeof window !== 'undefined') { // ensure this runs on client
            updateCryptoPrices(initialHoldings, arsRate);
        }
    }, [updateCryptoPrices, arsRate, cryptoHoldings.length]);
    
    useEffect(() => {
        if (cryptoHoldings.length > 0) {
            const interval = setInterval(() => {
                updateCryptoPrices(cryptoHoldings, arsRate);
            }, 60000); // refresh every minute
            return () => clearInterval(interval);
        }
    }, [cryptoHoldings, updateCryptoPrices, arsRate]);

    const filteredTransactions = useMemo(() => {
        if (!currentDate) return [];
        return allTransactions.filter(t => 
            getYear(t.date) === getYear(currentDate) && 
            getMonth(t.date) === getMonth(currentDate)
        );
    }, [allTransactions, currentDate]);

    const expenses = useMemo(() => filteredTransactions.filter(t => t.type === 'expense').sort((a,b) => a.date.getTime() - b.date.getTime()), [filteredTransactions]);
    const incomes = useMemo(() => filteredTransactions.filter(t => t.type === 'income').sort((a,b) => a.date.getTime() - b.date.getTime()), [filteredTransactions]);
    
    const handleTransactionChange = (updatedTransaction: Transaction) => {
        setAllTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    }
    
    const handleAddIncome = () => {
        if (!currentDate) return;
        const newTransaction: Transaction = {
          id: `income-${Date.now()}`,
          date: new Date(currentDate),
          description: '',
          amount: 0,
          type: 'income',
          category: 'Ingresos',
        };
        setAllTransactions(prev => [...prev, newTransaction]);
    }

    const handleAddExpense = (newExpenseData: Omit<Transaction, 'id' | 'date' | 'type' | 'category'>) => {
        if (!currentDate) return;
        const newTransaction: Transaction = {
            ...newExpenseData,
            id: `expense-${Date.now()}`,
            date: new Date(currentDate),
            type: 'expense',
            category: newExpenseData.description, // Or a default category
        };
        setAllTransactions(prev => [...prev, newTransaction]);
    };
    
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
                quantity: quantity
            };
            newHoldings = [...cryptoHoldings, newHolding];
        }
        updateCryptoPrices(newHoldings, arsRate);
    };

    const handleRemoveCryptoHolding = (id: string) => {
        const newHoldings = cryptoHoldings.filter(h => h.id !== id);
        updateCryptoPrices(newHoldings, arsRate);
    };
    
    const handleRemoveExpense = (id: string) => {
        setAllTransactions(prev => prev.filter(t => t.id !== id));
    };

    if (!currentDate) {
        // Render a loading state or nothing while date is being set
        return null;
    }

    return (
        <div className="space-y-4">
            <MonthlySheetHeader currentDate={currentDate} setCurrentDate={setCurrentDate} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1 space-y-4">
                    <ExpensesTable 
                        expenses={expenses}
                        onExpenseChange={handleTransactionChange}
                        onAddExpense={handleAddExpense}
                        onRemoveExpense={handleRemoveExpense}
                    />
                </div>
                <div className="lg:col-span-1 space-y-4">
                    <IncomeTable 
                        incomes={incomes}
                        onIncomeChange={handleTransactionChange}
                        onAddIncome={handleAddIncome}
                    />
                    <SummarySection transactions={filteredTransactions} arsRate={arsRate}/>
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
