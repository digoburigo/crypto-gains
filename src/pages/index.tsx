import type { NextPage, NextPageContext } from 'next';
import type { Coin } from '~api/coingecko';
import { COINS_FETCH_QUERIES } from '~api/coingecko';
import CoinsTable from '~components/CoinsTable';
import CurrencyDropdown from '~components/CurrencyDropdown';
import { CURRENCIES } from '~state/system';

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Crypto Gains 🔥</h1>
        <CurrencyDropdown currencies={CURRENCIES} />
      </div>
      <CoinsTable coins={coins} />
    </div>
  );
};

export default Home;
