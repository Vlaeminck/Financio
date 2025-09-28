
'use client';

import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchCoins } from '@/lib/actions';
import Image from 'next/image';

type Coin = {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
};

type CryptoSearchProps = {
  onAddHolding: (coin: Coin, quantity: number) => void;
};

export function CryptoSearch({ onAddHolding }: CryptoSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [quantity, setQuantity] = useState('');
  const [isSearching, startSearchTransition] = useTransition();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery.length > 2) {
      startSearchTransition(async () => {
        const coins = await searchCoins(newQuery);
        setResults(coins);
      });
    } else {
      setResults([]);
    }
  };
  
  const handleSelectCoin = (coin: Coin) => {
    setSelectedCoin(coin);
    setQuery(coin.name);
    setResults([]);
  }

  const handleAdd = () => {
    if (selectedCoin && quantity) {
      const numQuantity = parseFloat(quantity);
      if (!isNaN(numQuantity) && numQuantity > 0) {
        onAddHolding(selectedCoin, numQuantity);
        setSelectedCoin(null);
        setQuantity('');
        setQuery('');
      }
    }
  };

  return (
    <div className="p-2 space-y-2">
      <div className="relative">
        <Input
          type="text"
          placeholder="Buscar criptomoneda..."
          value={query}
          onChange={handleSearch}
          className="bg-background"
        />
        {results.length > 0 && (
          <ul className="absolute z-10 w-full bg-card border rounded-md mt-1 max-h-60 overflow-y-auto">
            {results.map(coin => (
              <li 
                key={coin.id} 
                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-muted"
                onClick={() => handleSelectCoin(coin)}
              >
                <Image src={coin.thumb} alt={coin.name} width={24} height={24} />
                <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedCoin && (
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Cantidad"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="bg-background"
          />
          <Button onClick={handleAdd}>Añadir</Button>
        </div>
      )}
    </div>
  );
}
