import { FC, useMemo } from 'react';
import { UseQueryResult } from 'react-query';
import { useSortBy, useTable } from 'react-table';
import { Coin } from '../api/types';

interface Props {
  coins: UseQueryResult<Coin, unknown>[];
}

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

  const columns = useMemo(
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
    } as any,
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
          {
            // Loop over the header rows
            headerGroups.map((headerGroup) => (
              // Apply the header row props
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column, index) => (
                    // Apply the header cell props
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {
                        // Render the header
                        column.render('Header')
                      }
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        {/* Apply the table body props */}
        <tbody {...getTableBodyProps()}>
          {
            // Loop over the table rows
            rows.map((row) => {
              // Prepare the row for display
              prepareRow(row);
              return (
                // Apply the row props
                <tr {...row.getRowProps()}>
                  {
                    // Loop over the rows cells
                    row.cells.map((cell) => {
                      // Apply the cell props
                      return (
                        <td {...cell.getCellProps()}>
                          {
                            // Render the cell contents
                            cell.render('Cell')
                          }
                        </td>
                      );
                    })
                  }
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
};

export default CoinsTable;
