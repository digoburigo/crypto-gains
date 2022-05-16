import type { FC } from 'react';
import { useMemo } from 'react';
import type { Column } from 'react-table';
import { useSortBy, useTable } from 'react-table';
import type { Coin } from '~api/coingecko';

type Props = {
  coins: Coin[];
};

type CoinsTableColumns = {
  coin: string;
  price: number;
  atl: number;
  atlDate?: string;
  ath: number;
  athDate?: string;
  gains: number;
  marketCap: number | undefined;
  circulatingSupply: number;
  totalSupply: number | null;
  maxSupply: number | null;
  homePage?: string;
};

function currencyFormat(num: number, dollarSymbol = true) {
  return (
    (dollarSymbol ? '$' : '') +
    num?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  );
}

const CoinsTable: FC<Props> = ({ coins }) => {
  const data = useMemo(
    () =>
      coins.map((coin) => ({
        coin: `${coin?.name} (${coin?.symbol?.toUpperCase()})`,
        price: coin?.market_data?.current_price?.usd || 0,
        ath: coin?.market_data?.ath?.usd || 0,
        athDate: new Date(
          coin?.market_data?.ath_date?.usd as string
        ).toLocaleDateString('pt-BR'),
        atl: coin?.market_data?.atl?.usd || 0,
        atlDate: new Date(
          coin?.market_data?.atl_date?.usd as string
        ).toLocaleDateString('pt-BR'),
        gains:
          (coin?.market_data?.ath?.bmd || 1) /
          (coin?.market_data?.current_price?.usd || 1),
        marketCap: coin?.market_data?.market_cap?.usd,
        circulatingSupply: coin?.market_data?.circulating_supply,
        totalSupply: coin?.market_data?.total_supply,
        maxSupply: coin?.market_data?.max_supply,
        homePage: coin?.links.homepage[0],
      })),
    [coins]
  );

  const columns = useMemo<Column<CoinsTableColumns>[]>(
    () => [
      {
        Header: 'Coin',
        accessor: 'coin',
        Cell: ({ row, value }) => (
          <a
            className="btn btn-link text-slate-300 font-bold p-0 h-1"
            href={row.original.homePage}
            target="_blank"
            rel="noreferrer"
          >
            {' '}
            {value}{' '}
          </a>
        ),
      },
      {
        Header: 'Current Price',
        accessor: 'price',
        Cell: ({ value }) => <div> {currencyFormat(value)} </div>,
      },
      {
        Header: 'All-Time Low',
        accessor: 'atl',
        Cell: ({ row, value }) => (
          <div>
            {' '}
            {currencyFormat(value)} ({row?.original?.atlDate})
          </div>
        ),
      },
      {
        Header: 'All-Time High',
        accessor: 'ath',
        Cell: ({ row, value }) => (
          <div>
            {' '}
            {currencyFormat(value)} ({row?.original?.athDate}){' '}
          </div>
        ),
      },
      {
        Header: 'Gains',
        accessor: 'gains',
        Cell: ({ value }) => <div> {value.toFixed(2) + 'x'} </div>,
      },
      {
        Header: 'Market Cap',
        accessor: 'marketCap',
        Cell: ({ value }) => <div> {currencyFormat(value as number)} </div>,
      },
      {
        Header: 'Circulating Supply',
        accessor: 'circulatingSupply',
        Cell: ({ value }) => (
          <div> {value ? currencyFormat(value, false) : '∞'} </div>
        ),
      },
      {
        Header: 'Total Supply',
        accessor: 'totalSupply',
        Cell: ({ value }) => (
          <div> {value ? currencyFormat(value, false) : '∞'} </div>
        ),
      },
      {
        Header: 'Max Supply',
        accessor: 'maxSupply',
        Cell: ({ value }) => (
          <div> {value ? currencyFormat(value, false) : '∞'} </div>
        ),
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
    <div className="overflow-x-auto h-[calc(100vh-120px)]">
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
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="sticky top-0"
                >
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
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      className={index === 0 ? 'sticky left-0' : ''}
                      {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                    </td>
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
