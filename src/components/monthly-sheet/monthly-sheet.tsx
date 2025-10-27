
'use client';

import { useState, useMemo, useEffect, useCallback, memo } from 'react';
import { MonthlySheetHeader } from './monthly-sheet-header';
import { ExpensesTable } from './expenses-table';
import { IncomeTable } from './income-table';
import { CryptoTable } from './crypto-table';
import { SummarySection } from './summary-section';
import type { Transaction, CryptoHolding, FearAndGreed, DolarType } from '@/lib/types';
import { getMonth, getYear, addMonths } from 'date-fns';
import { getCoinPrices, getDolarCriptoRate, getFearAndGreedIndex, getDolarBlueRate, getDolarOficialRate } from '@/lib/actions';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, writeBatch, where, query, getDocs } from 'firebase/firestore';
import { cn } from '@/lib/utils';


const initialCryptoHoldings: Omit<CryptoHolding, 'price' | 'valueUsd' | 'valueArs'>[] = [];

// Memoize components to prevent re-rendering when props don't change
const MemoizedExpensesTable = memo(ExpensesTable);
const MemoizedIncomeTable = memo(IncomeTable);
const MemoizedCryptoTable = memo(CryptoTable);
const MemoizedSummarySection = memo(SummarySection);


export function MonthlySheet() {
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
    const [currentDate, setCurrentDate] = useState<Date | null>(null);
    const [cryptoHoldings, setCryptoHoldings] = useState<CryptoHolding[]>([]);
    const [dolarRates, setDolarRates] = useState({ cripto: 1000, blue: 1000, oficial: 1000 });
    const [selectedDolarType, setSelectedDolarType] = useState<DolarType>('cripto');
    const [fearAndGreed, setFearAndGreed] = useState<FearAndGreed | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCryptoEnabled, setIsCryptoEnabled] = useState(false);

     useEffect(() => {
        const enabled = localStorage.getItem('cryptoEnabled') === 'true';
        setIsCryptoEnabled(enabled);

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'cryptoEnabled') {
                setIsCryptoEnabled(event.newValue === 'true');
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        if (!currentDate) {
          setCurrentDate(new Date());
        }
    }, [currentDate]);

    useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, "transactions"), (snapshot) => {
          const transactionsData = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                  ...data,
                  id: doc.id,
                  date: (data.date as any).toDate(),
              } as Transaction;
          });
          setAllTransactions(transactionsData);
          setLoading(false);
      });

      return () => unsubscribe();
  }, []);

    const updateFearAndGreedIndex = useCallback(async () => {
        if (!isCryptoEnabled) return;
        const data = await getFearAndGreedIndex();
        if (data) {
            setFearAndGreed(data);
        }
    }, [isCryptoEnabled]);

    const updateDolarRates = useCallback(async () => {
        const [blueRate, oficialRate, criptoRate] = await Promise.all([
            getDolarBlueRate(),
            getDolarOficialRate(),
            isCryptoEnabled ? getDolarCriptoRate() : Promise.resolve(null),
        ]);
        
        setDolarRates(prev => ({
            cripto: criptoRate ?? prev.cripto,
            blue: blueRate ?? prev.blue,
            oficial: oficialRate ?? prev.oficial,
        }));
    }, [isCryptoEnabled]);

    const arsRate = dolarRates[selectedDolarType];

    const updateCryptoPrices = useCallback(async (holdingsToUpdate: Omit<CryptoHolding, 'price' | 'valueUsd' | 'valueArs'>[], currentArsRate: number) => {
        if (!isCryptoEnabled) return;
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
    }, [isCryptoEnabled]);

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
        if (isCryptoEnabled) {
            const initialHoldings = initialCryptoHoldings.map(h => ({...h, price:0, valueUsd: 0, valueArs: 0}));
            if(cryptoHoldings.length === 0 && typeof window !== 'undefined') {
                updateCryptoPrices(initialHoldings, arsRate);
            }
        } else {
            setCryptoHoldings([]);
        }
    }, [isCryptoEnabled, updateCryptoPrices, arsRate, cryptoHoldings.length]);
    
    useEffect(() => {
        if (isCryptoEnabled) {
            updateCryptoPrices(cryptoHoldings, arsRate);
        }
    }, [arsRate, updateCryptoPrices, isCryptoEnabled]);

    useEffect(() => {
        if (isCryptoEnabled && cryptoHoldings.length > 0) {
            const interval = setInterval(() => {
                setCryptoHoldings(currentHoldings => {
                    updateCryptoPrices(currentHoldings, arsRate);
                    return currentHoldings;
                });
            }, 60000); // refresh every minute
            return () => clearInterval(interval);
        }
    }, [cryptoHoldings, updateCryptoPrices, arsRate, isCryptoEnabled]);


    const filteredTransactions = useMemo(() => {
        if (!currentDate) return [];
        return allTransactions.filter(t => 
            getYear(t.date) === getYear(currentDate) && 
            getMonth(t.date) === getMonth(currentDate)
        );
    }, [allTransactions, currentDate]);

    const expenses = useMemo(() => filteredTransactions.filter(t => t.type === 'expense').sort((a,b) => {
        if (a.fixed && !b.fixed) return -1;
        if (!a.fixed && b.fixed) return 1;
        return a.date.getTime() - b.date.getTime()
    }), [filteredTransactions]);
    const incomes = useMemo(() => filteredTransactions.filter(t => t.type === 'income').sort((a,b) => a.date.getTime() - b.date.getTime()), [filteredTransactions]);
    
    const handleTransactionChange = useCallback(async (updatedTransaction: Transaction) => {
        const { id, ...dataToUpdate } = updatedTransaction;
        const docRef = doc(db, 'transactions', id);
        await updateDoc(docRef, {
          ...dataToUpdate,
          date: updatedTransaction.date
        });
    }, []);
    
    const handleAddIncome = useCallback(async (newIncomeData: { description: string; amount: number }) => {
        if (!currentDate) return;
        const newTransaction = {
          date: currentDate,
          description: newIncomeData.description,
          amount: newIncomeData.amount,
          type: 'income',
          category: 'Ingresos',
        };
        await addDoc(collection(db, 'transactions'), newTransaction);
    }, [currentDate]);

    const handleAddExpense = useCallback(async (newExpenseData: Omit<Transaction, 'id' | 'date' | 'type' | 'category'>) => {
        if (!currentDate) return;
        const newTransaction = {
            ...newExpenseData,
            date: currentDate,
            type: 'expense',
            category: newExpenseData.description,
        };
        await addDoc(collection(db, 'transactions'), newTransaction);
    }, [currentDate]);
    
    const handleAddCryptoHolding = useCallback((coin: { id: string; name: string; symbol: string }, quantity: number) => {
        if (!isCryptoEnabled) return;
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
    }, [isCryptoEnabled, cryptoHoldings, arsRate, updateCryptoPrices]);

    const handleRemoveCryptoHolding = useCallback((id: string) => {
        if (!isCryptoEnabled) return;
        const newHoldings = cryptoHoldings.filter(h => h.id !== id);
        updateCryptoPrices(newHoldings, arsRate);
    }, [isCryptoEnabled, cryptoHoldings, arsRate, updateCryptoPrices]);
    
    const handleRemoveExpense = useCallback(async (id: string) => {
        await deleteDoc(doc(db, 'transactions', id));
    }, []);

    const handleRemoveIncome = useCallback(async (id: string) => {
        await deleteDoc(doc(db, 'transactions', id));
    }, []);

    const handleReplicateMonth = useCallback(async () => {
        if (!currentDate) return;
        const nextMonthDate = addMonths(currentDate, 1);
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
    
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

        const q = query(
          collection(db, "transactions"),
          where("date", ">=", startOfMonth),
          where("date", "<=", endOfMonth)
        );
        
        const querySnapshot = await getDocs(q);
        
        const batch = writeBatch(db);
    
        querySnapshot.forEach(document => {
            const t = document.data() as Omit<Transaction, 'id' | 'date'>;
            const newTransaction = { ...t };
            if (newTransaction.type === 'expense') {
                newTransaction.paid = false;
            }
            const newDocRef = doc(collection(db, "transactions"));
            batch.set(newDocRef, { ...newTransaction, date: nextMonthDate });
        });
    
        await batch.commit();
        setCurrentDate(nextMonthDate);
    }, [currentDate]);


    if (!currentDate || loading) {
        return null; // or a loading skeleton
    }

    return (
        <div className="space-y-4">
            <MonthlySheetHeader 
                currentDate={currentDate} 
                setCurrentDate={setCurrentDate}
                onReplicateMonth={handleReplicateMonth}
                dolarCripto={dolarRates.cripto}
                dolarBlue={dolarRates.blue}
                dolarOficial={dolarRates.oficial}
                isCryptoEnabled={isCryptoEnabled}
            />
            <div className={cn(
                "grid grid-cols-1 lg:grid-cols-3 gap-4",
                !isCryptoEnabled && "lg:grid-cols-2"
            )}>
                <div className="lg:col-span-1 space-y-4">
                    <MemoizedExpensesTable 
                        expenses={expenses}
                        onExpenseChange={handleTransactionChange}
                        onAddExpense={handleAddExpense}
                        onRemoveExpense={handleRemoveExpense}
                    />
                </div>
                <div className="lg:col-span-1 space-y-4">
                    <MemoizedIncomeTable 
                        incomes={incomes}
                        onIncomeChange={handleTransactionChange}
                        onAddIncome={handleAddIncome}
                        onRemoveIncome={handleRemoveIncome}
                    />
                    <MemoizedSummarySection
                        transactions={filteredTransactions} 
                        arsRate={arsRate}
                        dolarRates={dolarRates}
                        selectedDolarType={selectedDolarType}
                        setSelectedDolarType={setSelectedDolarType}
                        isCryptoEnabled={isCryptoEnabled}
                    />
                </div>
                {isCryptoEnabled && (
                    <div className="lg-col-span-1 space-y-4">
                        <MemoizedCryptoTable 
                            holdings={cryptoHoldings} 
                            fearAndGreed={fearAndGreed}
                            onAddHolding={handleAddCryptoHolding}
                            onRemoveHolding={handleRemoveCryptoHolding}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
