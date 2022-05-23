import type { FC } from 'react';
import { useMemo, useState } from 'react';
import type { Column } from 'react-table';
import { useSortBy, useTable } from 'react-table';
import type { Coin } from '~api/coingecko';
import type { Currency } from '~state/system';
import { useSystemStore } from '~state/system';
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
  coingeckoLink?: string;
  thumbImage?: string;
};

const currencyFormat = ({
  value,
  currency,
  decimalPlaces,
}: {
  value: number;
  currency?: Currency;
  decimalPlaces?: number;
}) => {
  return new Intl.NumberFormat('en-US', {
    style: currency ? 'currency' : 'decimal',
    currency: currency?.code || 'USD',
    minimumFractionDigits: decimalPlaces ?? currency?.decimalPlaces ?? 2,
  }).format(value);
};

const CoinsTable: FC<Props> = ({ coins }) => {
  const currency = useSystemStore((state) => state.currency);

  const data = useMemo(
    () =>
      coins.map((coin) => ({
        coin: `${coin?.name} (${coin?.symbol?.toUpperCase()})`,
        price: coin?.market_data?.current_price?.[currency.code] || 0,
        ath: coin?.market_data?.ath?.[currency.code] || 0,
        athDate: new Date(
          coin?.market_data?.ath_date?.[currency.code] as string
        ).toLocaleDateString('pt-BR'),
        atl: coin?.market_data?.atl?.[currency.code] || 0,
        atlDate: new Date(
          coin?.market_data?.atl_date?.[currency.code] as string
        ).toLocaleDateString('pt-BR'),
        gains:
          (coin?.market_data?.ath?.[currency.code] || 1) /
          (coin?.market_data?.current_price?.[currency.code] || 1),
        marketCap: coin?.market_data?.market_cap?.[currency.code],
        circulatingSupply: coin?.market_data?.circulating_supply,
        totalSupply: coin?.market_data?.total_supply,
        maxSupply: coin?.market_data?.max_supply,
        homePage: coin?.links?.homepage[0],
        coingeckoLink: `https://www.coingecko.com/en/coins/${coin.id}`,
        thumbImage: coin.image.thumb,
      })),
    [coins, currency]
  );

  const columns = useMemo<Column<CoinsTableColumns>[]>(
    () => [
      {
        Header: 'Coin',
        accessor: 'coin',
        Cell: ({ row, value }) => (
          <div className="flex justify-start items-center">
            <a
              className="btn btn-link text-slate-300 font-bold p-0 h-1 text-xs"
              href={row.original.homePage}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={row.original.thumbImage}
                alt="thumb"
                width="16"
                height="16"
                loading="lazy"
                className="mr-2"
              />
              <span>{value}</span>
            </a>
            <a
              href={row.original.coingeckoLink}
              target="_blank"
              rel="noreferrer"
              className="ml-3"
            >
              <img
                src="https://static.coingecko.com/s/gecko_guide-1ef9afef542eb4df53e9e480bc63a209cd3327410466c903d166e5f7ff7f3644.svg"
                alt="thumb"
                width="16"
                height="16"
                loading="lazy"
              />
            </a>
          </div>
        ),
      },
      {
        Header: 'Current Price',
        accessor: 'price',
        Cell: ({ value }) => <div> {currencyFormat({ value, currency })} </div>,
      },
      {
        Header: 'All-Time Low',
        accessor: 'atl',
        Cell: ({ row, value }) => (
          <div>
            {' '}
            {currencyFormat({ value, currency })} ({row?.original?.atlDate})
          </div>
        ),
      },
      {
        Header: 'All-Time High',
        accessor: 'ath',
        Cell: ({ row, value }) => (
          <div>
            {' '}
            {currencyFormat({ value, currency })} ({row?.original?.athDate}){' '}
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
        Cell: ({ value }) => (
          <div>
            {' '}
            {currencyFormat({ value, currency, decimalPlaces: 2 } as {
              value: number;
            })}{' '}
          </div>
        ),
      },
      {
        Header: 'Circulating Supply',
        accessor: 'circulatingSupply',
        Cell: ({ value }) => (
          <div> {value ? currencyFormat({ value }) : '∞'} </div>
        ),
      },
      {
        Header: 'Total Supply',
        accessor: 'totalSupply',
        Cell: ({ value }) => (
          <div> {value ? currencyFormat({ value }) : '∞'} </div>
        ),
      },
      {
        Header: 'Max Supply',
        accessor: 'maxSupply',
        Cell: ({ value }) => (
          <div> {value ? currencyFormat({ value }) : '∞'} </div>
        ),
      },
    ],
    [currency]
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

  const [rowIndexHovered, setRowIndexHovered] = useState<number | null>(null);

  const handleMouseHover = (rowIndex: number | null) => {
    if (rowIndex === null) {
      setRowIndexHovered(null);
      return;
    }
    setRowIndexHovered(rowIndex);
  };

  return (
    <div className="overflow-x-auto h-[calc(100vh-140px)]">
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
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={rowIndex === rowIndexHovered ? 'active' : ''}
                onMouseEnter={() => handleMouseHover(rowIndex)}
                onMouseLeave={() => handleMouseHover(null)}
              >
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
