import { Card, Classes, Colors, H2, H3, HTMLDivProps, Icon, Text } from '@blueprintjs/core';
import { Transaction } from '@prisma/client';
import Router from 'next/router';
import React from 'react';
import styles from '../styles/util.module.scss';

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
      className={`flex items-center justify-between w-full p-2 ${
        skeleton ? Classes.SKELETON : ''
      } ${className}`}
      interactive
      onClick={() => Router.push(`/account/${transaction.id}`)}
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
      <div className="flex items-center">
        <H2
          className="mb-0"
          style={{
            color: transaction.amount > 0 ? Colors.GREEN3 : Colors.RED3,
          }}
        >
          {transaction.amount < 0 && '-'}${Math.abs(transaction.amount).toFixed(2)}
        </H2>
      </div>
    </Card>
  );
};

export default TransactionCard;
