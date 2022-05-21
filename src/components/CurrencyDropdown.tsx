import type { FC } from 'react';
import { Currency, useSystemStore } from '~state/system';

type Props = {
  currencies: Currency[];
};

const CurrencyDropdown: FC<Props> = ({ currencies }) => {
  const currency = useSystemStore((state) => state.currency);
  const setCurrency = useSystemStore((state) => state.setCurrency);

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn m-1 min-w-[100px]">
        🤑 {currency.label}
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        {currencies.map((currency, index) => (
          <li key={index} onClick={() => setCurrency(currency)}>
            <span>{currency.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CurrencyDropdown;
