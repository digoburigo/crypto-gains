import type { FC } from 'react';
import { useMemo } from 'react';
import type { UseQueryResult } from 'react-query';
import type { Column } from 'react-table';
import { useSortBy, useTable } from 'react-table';
import type { Coin } from '~api/coingecko';

type Props = {
  coins: UseQueryResult<Coin, unknown>[];
};

type CoinsTableColumns = {
  coin: string;
  price: string;
  atl: string;
  ath: string;
  gains: string;
  marketCap: string;
  circulatingSupply: string;
  totalSupply: string;
  maxSupply: string;
};

function currencyFormat(num: number, dollarSymbol = true) {
  return (
    (dollarSymbol ? '$' : '') +
    num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  );
}

const CoinsTable: FC<Props> = ({ coins }) => {
  const data = useMemo(
    () =>
      coins.map(({ data: coin }) => ({
        coin: `${coin?.name} (${coin?.symbol?.toUpperCase()})`,
        price: currencyFormat(coin?.market_data?.current_price?.usd || 0),
        ath: `${currencyFormat(coin?.market_data?.ath?.usd || 0)} (${new Date(
          coin?.market_data?.ath_date?.usd as string
        ).toLocaleDateString('pt-BR')})`,
        atl: `${currencyFormat(coin?.market_data?.atl?.usd || 0)} (${new Date(
          coin?.market_data?.atl_date?.usd as string
        ).toLocaleDateString('pt-BR')})`,
        gains:
          (
            (coin?.market_data?.ath?.bmd || 1) /
            (coin?.market_data?.current_price?.usd || 1)
          ).toFixed(2) + 'x',
        marketCap: currencyFormat(coin?.market_data?.market_cap?.usd || 0),
        circulatingSupply: coin?.market_data?.circulating_supply
          ? currencyFormat(coin?.market_data?.circulating_supply, false)
          : '∞',
        totalSupply: coin?.market_data?.total_supply
          ? currencyFormat(coin?.market_data?.total_supply, false)
          : '∞',
        maxSupply: coin?.market_data?.max_supply
          ? currencyFormat(coin?.market_data?.max_supply, false)
          : '∞',
      })),
    [coins]
  );

  const columns = useMemo<Column<CoinsTableColumns>[]>(
    () => [
      {
        Header: 'Coin',
        accessor: 'coin',
      },
      {
        Header: 'Current Price',
        accessor: 'price',
      },
      {
        Header: 'All-Time Low',
        accessor: 'atl',
      },
      {
        Header: 'All-Time High',
        accessor: 'ath',
      },
      {
        Header: 'Gains',
        accessor: 'gains',
      },
      {
        Header: 'Market Cap',
        accessor: 'marketCap',
      },
      {
        Header: 'Circulating Supply',
        accessor: 'circulatingSupply',
      },
      {
        Header: 'Total Supply',
        accessor: 'totalSupply',
      },
      {
        Header: 'Max Supply',
        accessor: 'maxSupply',
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: 'gains',
            desc: true,
          },
        ],
      },
    },
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="overflow-x-auto">
      <table
        {...getTableProps()}
        className="table table-zebra table-compact w-full"
      >
        <thead>
          {/* eslint-disable react/jsx-key */}
          {/* the jsx key is provided in the .get*Props() spreads, but eslint doesn't believe you. I believe you. */}
          {headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {(column as any).isSorted
                      ? (column as any).isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CoinsTable;
