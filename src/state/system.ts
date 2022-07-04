import create from 'zustand';

export type Currency = {
  label: string;
  code: 'usd' | 'btc' | 'eth';
  symbol: string;
  decimalPlaces: number;
};

export const CURRENCIES: Currency[] = [
  { label: 'US Dollar', code: 'usd', symbol: '$', decimalPlaces: 2 },
  { label: 'Bitcoin', code: 'btc', symbol: '₿', decimalPlaces: 8 },
  { label: 'Ethereum', code: 'eth', symbol: 'Ξ', decimalPlaces: 8 },
];

export type SystemState = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

export const useSystemStore = create<SystemState>((set) => ({
  currency: CURRENCIES[0] as Currency,
  setCurrency: (currency: Currency) => set(() => ({ currency })),
}));
