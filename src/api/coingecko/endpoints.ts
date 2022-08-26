import type { Coin } from './types';
export const COINGECKO_API = 'https://api.coingecko.com';

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
  'helium',
  'serum',
  'acala',
  'filecoin',
  'arweave',
  'moonbeam',
  'linkpool',
  'astar',
  'storj',
  'olympus',
  'origin-protocol',
  'evmos',
  '1inch',
  'curve-dao-token',
  'compound-governance-token',
  'maker',
  'convex-finance',
  'numeraire',
  'lyra-finance',
  'radicle',
  'livepeer',
  'theta-token',
  'ergo',
  'gains-network',
  'hedera-hashgraph',
  'gnosis',
  'immutable-x',
];

const COINS_IDS_TEST = ['bitcoin', 'ethereum'];

const COINS_TO_USE =
  process.env.NODE_ENV === 'production' ? COINS_IDS : COINS_IDS_TEST;

export const COINS_QUERIES = COINS_TO_USE.map((id) => {
  return { queryKey: ['coin', id], queryFn: () => getCoinById(id) };
});

export function getCoinById(id: string): Promise<Coin> {
  return fetch(`${COINGECKO_API}/api/v3/coins/${id}`).then((res) => res.json());
}
