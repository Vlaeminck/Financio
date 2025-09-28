
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { MonthlySheetHeader } from './monthly-sheet-header';
import { ExpensesTable } from './expenses-table';
import { IncomeTable } from './income-table';
import { CryptoTable } from './crypto-table';
import { SummarySection } from './summary-section';
import { TRANSACTIONS } from '@/lib/data';
import type { Transaction, CryptoHolding, FearAndGreed } from '@/lib/types';
import { getMonth, getYear } from 'date-fns';
import { getCoinPrices, getDolarCriptoRate, getFearAndGreedIndex, getDolarBlueRate, getDolarOficialRate } from '@/lib/actions';

const initialCryptoHoldings: Omit<CryptoHolding, 'price' | 'valueUsd' | 'valueArs'>[] = [];

export function MonthlySheet() {
    const [allTransactions, setAllTransactions] = useState<Transaction[]>(TRANSACTIONS);
    const [currentDate, setCurrentDate] = useState<Date | null>(null);
    const [cryptoHoldings, setCryptoHoldings] = useState<CryptoHolding[]>([]);
    const [dolarCripto, setDolarCripto] = useState(1000);
    const [dolarBlue, setDolarBlue] = useState<number>();
    const [dolarOficial, setDolarOficial] = useState<number>();
    const [fearAndGreed, setFearAndGreed] = useState<FearAndGreed | null>(null);

    useEffect(() => {
        // Set initial date on client to avoid hydration mismatch
        if (!currentDate) {
          setCurrentDate(new Date('2024-10-01T00:00:00Z'));
        }
    }, [currentDate]);

    const updateFearAndGreedIndex = useCallback(async () => {
        const data = await getFearAndGreedIndex();
        if (data) {
            setFearAndGreed(data);
        }
    }, []);

    const updateDolarRates = useCallback(async () => {
        const criptoRate = await getDolarCriptoRate();
        if (criptoRate) setDolarCripto(criptoRate);
        
        const blueRate = await getDolarBlueRate();
        if (blueRate) setDolarBlue(blueRate);

        const oficialRate = await getDolarOficialRate();
        if (oficialRate) setDolarOficial(oficialRate);
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
        updateDolarRates();
        updateFearAndGreedIndex();
        const rateInterval = setInterval(updateDolarRates, 3600000); // refresh every hour
        const fngInterval = setInterval(updateFearAndGreedIndex, 3600000); // refresh every hour
        return () => {
            clearInterval(rateInterval);
            clearInterval(fngInterval);
        }
    }, [updateDolarRates, updateFearAndGreedIndex]);

    useEffect(() => {
        const initialHoldings = initialCryptoHoldings.map(h => ({...h, price:0, valueUsd: 0, valueArs: 0}));
        if(cryptoHoldings.length === 0 && typeof window !== 'undefined') { // ensure this runs on client
            updateCryptoPrices(initialHoldings, dolarCripto);
        }
    }, [updateCryptoPrices, dolarCripto, cryptoHoldings.length]);
    
    useEffect(() => {
        if (cryptoHoldings.length > 0) {
            const interval = setInterval(() => {
                updateCryptoPrices(cryptoHoldings, dolarCripto);
            }, 60000); // refresh every minute
            return () => clearInterval(interval);
        }
    }, [cryptoHoldings, updateCryptoPrices, dolarCripto]);

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
    
    const handleAddIncome = (newIncomeData: { description: string; amount: number }) => {
        if (!currentDate) return;
        const newTransaction: Transaction = {
          id: `income-${Date.now()}`,
          date: new Date(currentDate),
          description: newIncomeData.description,
          amount: newIncomeData.amount,
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
        updateCryptoPrices(newHoldings, dolarCripto);
    };

    const handleRemoveCryptoHolding = (id: string) => {
        const newHoldings = cryptoHoldings.filter(h => h.id !== id);
        updateCryptoPrices(newHoldings, dolarCripto);
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
            <MonthlySheetHeader 
                currentDate={currentDate} 
                setCurrentDate={setCurrentDate} 
                dolarCripto={dolarCripto}
                dolarBlue={dolarBlue}
                dolarOficial={dolarOficial}
            />
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
                    <SummarySection transactions={filteredTransactions} arsRate={dolarCripto}/>
                </div>
                <div className="lg:col-span-1 space-y-4">
                    <CryptoTable 
                        holdings={cryptoHoldings} 
                        fearAndGreed={fearAndGreed}
                        onAddHolding={handleAddCryptoHolding}
                        onRemoveHolding={handleRemoveCryptoHolding}
                    />
                </div>
            </div>
        </div>
    );
}
