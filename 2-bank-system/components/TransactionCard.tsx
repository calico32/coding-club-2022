import { Card, Classes, H2, H3, HTMLDivProps, Icon, Text } from '@blueprintjs/core';
import { Transaction } from '@prisma/client';
import React from 'react';
import { balanceColor } from '../lib/util';
import styles from '../styles/util.module.scss';
import DollarAmount from './DollarAmount';

type TransactionCardProps = HTMLDivProps & ({ transaction: Transaction } | { skeleton: true });

const isSkeleton = (props: TransactionCardProps): props is { skeleton: true } => {
  return 'skeleton' in props;
};

const TransactionCard: React.VFC<TransactionCardProps> = props => {
  const skeleton = isSkeleton(props);
  const transaction: Transaction = skeleton
    ? {
        id: '',
        amount: 0,
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        accountId: '',
      }
    : props.transaction;

  const { skeleton: _, account: __, className, ...otherProps } = props as any;

  return (
    <Card
      key={transaction.id}
      className={`flex md:items-center justify-between w-full md:flex-row flex-col items-stretch p-2 ${
        skeleton ? Classes.SKELETON : ''
      } ${className}`}
      {...otherProps}
    >
      <div className="flex flex-col">
        <div className="flex items-center">
          <Icon icon="dollar" size={24} className="mr-2" />
          <div className="flex items-baseline">
            <H3 className="mb-0 mr-2">{transaction.description}</H3>
            <Text className={`mb-0 text-sm ${styles.muted}`}>{transaction.id}</Text>
          </div>
        </div>
        <Text className={`${styles.muted} text-sm mt-1`}>
          {new Date(transaction.createdAt).toLocaleString()}
        </Text>
      </div>
      <div className="flex items-center justify-end mt-2 md:mt-0">
        <H2 className="mb-0" style={{ color: balanceColor(transaction.amount) }}>
          <DollarAmount amount={transaction.amount} />
        </H2>
      </div>
    </Card>
  );
};

export default TransactionCard;
