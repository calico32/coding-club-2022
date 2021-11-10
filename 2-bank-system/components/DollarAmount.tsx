import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import React from 'react';

const suffixes = '/K/M/B/T/Qa/Qi/Sx/Sp/Oc/No/Dc/Ud/Dd/Td/Qad/Qid/Sxd/Spd/Ocd/Nod'.split('/');
const perTenSuffixes = '/U/D/T/Qa/Qi/Sx/Sp/Oc/No'.split('/');
const tensSuffixes = 'Vg/Tg/Qg/Qq/Sg/St/Og/Ng'.split('/');

for (const ten of tensSuffixes) {
  for (const one of perTenSuffixes) {
    if (!one) suffixes.push(ten);
    else suffixes.push(one + ten.toLowerCase());
  }
}

const formatSimple = (n: number) =>
  `${n < 0 ? '-' : ''}$${Math.abs(n).toLocaleString('fullwide', { maximumFractionDigits: 2 })}`;

const formatComplcated = (n: number) => `${n < 0 ? '-' : ''}$${abbreviateNumber(Math.abs(n))}`;

const abbreviateNumber = (n: number) => {
  let suffixIndex = 0;
  while (n >= 1000) {
    n /= 1000;
    suffixIndex++;
  }

  return `${n.toPrecision(3)}${suffixes[suffixIndex]}`;
};

interface DollarAmountProps {
  amount: number;
}

const DollarAmount: React.VFC<DollarAmountProps> = ({ amount: n }) => {
  return Math.abs(n) < 1_000_000_000_000 ? (
    <span>{formatSimple(n)}</span>
  ) : (
    <Tooltip2 content={formatSimple(n)} className={Classes.TOOLTIP2_INDICATOR}>
      <span>{formatComplcated(n)}</span>
    </Tooltip2>
  );
};

export default DollarAmount;
