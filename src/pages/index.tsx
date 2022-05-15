import type { NextPage, NextPageContext } from 'next';
import { Coin, COINS_FETCH_QUERIES } from '~api/coingecko';
import CoinsTable from '../components/CoinsTable';

type Props = {
  coins: Coin[];
};

export async function getServerSideProps({ req, res }: NextPageContext) {
  res?.setHeader(
    'Cache-Control',
    'public, s-maxage=30, stale-while-revalidate=59'
  );

  const coins = await Promise.all(COINS_FETCH_QUERIES);

  return {
    props: {
      coins,
    },
  };
}

const Home: NextPage<Props> = ({ coins }) => {
  return (
    <div className="container mx-auto p-4 pt-8">
      <h1 className="text-2xl font-bold mb-8">Crypto Gains 🔥</h1>
      <CoinsTable coins={coins} />
    </div>
  );
};

export default Home;
