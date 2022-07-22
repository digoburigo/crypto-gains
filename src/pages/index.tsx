import { useQueries } from '@tanstack/react-query';
import type { NextPage } from 'next';
import type { Coin } from '~api/coingecko';
import { COINS_QUERIES } from '~api/coingecko';
import CoinsTable from '~components/CoinsTable';
import CurrencyDropdown from '~components/CurrencyDropdown';
import { CURRENCIES } from '~state/system';

const Home: NextPage = () => {
  const coins = useQueries({ queries: COINS_QUERIES }).map(
    (query) => query.data
  ) as Coin[];

  return (
    <div className="container mx-auto p-4 pt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Crypto Gains 🔥</h1>
        <CurrencyDropdown currencies={CURRENCIES} />
      </div>
      <CoinsTable coins={coins} />
    </div>
  );
};

export default Home;
