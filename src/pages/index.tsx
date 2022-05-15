import type { NextPage } from 'next';
import { useQueries } from 'react-query';
import { COINS_QUERIES } from '../api/coingecko';
import CoinsTable from '../components/CoinsTable';

const Home: NextPage = () => {
  const coins = useQueries(COINS_QUERIES);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Crypto Gains 🔥</h1>
      <CoinsTable coins={coins} />
    </div>
  );
};

export default Home;
