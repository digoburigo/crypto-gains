import type { Coin } from './types';

// https://docs.google.com/spreadsheets/d/1wTTuxXt8n9q7C4NDXqQpI3wpKu1_5bGVmP9Xz0XGSyU
const COINS_IDS = [
  'bitcoin',
  'ethereum',
  'cardano',
  'solana',
  'polkadot',
  'avalanche-2',
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
  'the-graph',
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
  'unibright',
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
  'serum',
  'acala',
  'filecoin',
  'arweave',
  'moonbeam',
  'astar',
  'olympus',
  'evmos',
];

const COINS_IDS_TEST = ['bitcoin'];

const COINS_TO_USE =
  process.env.NODE_ENV === 'production' ? COINS_IDS : COINS_IDS_TEST;

export const COINS_FETCH_QUERIES = COINS_TO_USE.map((id) => {
  return getCoinById(id);
});

export async function ping() {
  const response = await fetch(`${process.env.COINGECKO_API}/api/v3/ping`);
  const data = await response.json();
  return data;
}

export async function getCoinById(id: string): Promise<Coin> {
  const response = await fetch(
    `${process.env.COINGECKO_API}/api/v3/coins/${id}`
  );
  const data = await response.json();
  return data;
}
