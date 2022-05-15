import { Coin } from './types';

export const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// https://docs.google.com/spreadsheets/d/1wTTuxXt8n9q7C4NDXqQpI3wpKu1_5bGVmP9Xz0XGSyU
export const COINS_IDS = [
  'bitcoin',
  'ethereum',
  'cardano',
  'solana',
  'polkadot',
  // 'dogecoin',
  'avalanche-2',
  // 'shiba-inu',
  'matic-network',
  'near',
  'chainlink',
  'cosmos',
  'algorand',
  'uniswap',
  'apecoin',
  'elrond-erd-2',
  'aave',
  'thorchain',
  'fantom',
  'waves',
  'kusama',
  'havven',
  'loopring',
  'pax-gold',
  'osmosis',
  'rocket-pool',
  'everscale',
  'pocket-network',
  'dydx',
  'zelcash',
  'gmx',
  'looksrare',
  'energy-web-token',
  'liquity',
  'aurora-near',
  'ocean-protocol',
  'perpetual-protocol',
  'lukso-token',
  'singularitynet',
  'akash-network',
  'wrapped-centrifuge',
  'singularitydao',
  'goldfinch',
  'notional-finance',
];

export const COINS_QUERIES = COINS_IDS.map((id) => {
  return {
    queryKey: ['getCoinById', id],
    queryFn: () => getCoinById(id),
  };
});

export async function ping() {
  const response = await fetch(`${COINGECKO_API}/ping`);
  const data = response.json();
  return data;
}

export async function getCoinById(id: string): Promise<Coin> {
  const response = await fetch(`${COINGECKO_API}/coins/${id}`);
  const data = response.json();
  return data;
}