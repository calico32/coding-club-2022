import { Card, Classes, H3, HTMLDivProps, Icon, Text } from '@blueprintjs/core';
import { Account } from '@prisma/client';
import { useRouter } from 'next/router';
import React from 'react';
import { balanceColor } from '../lib/util';
import styles from '../styles/util.module.scss';
import DollarAmount from './DollarAmount';

type AccountCardProps = HTMLDivProps & ({ account: Account } | { skeleton: true });

const isSkeleton = (props: AccountCardProps): props is { skeleton: true } => {
  return 'skeleton' in props;
};

const AccountCard: React.VFC<AccountCardProps> = props => {
  const router = useRouter();
  const skeleton = isSkeleton(props);
  const account: Account = skeleton
    ? {
        id: '',
        name: '',
        balance: 0,
        description: '',
        userId: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    : props.account;

  const { skeleton: _, account: __, className, ...otherProps } = props as any;

  return (
    <Card
      key={account.id}
      className={`flex md:items-center md:justify-between w-full p-2 flex-col md:flex-row items-stretch ${
        skeleton ? Classes.SKELETON : ''
      } ${className}`}
      interactive
      onClick={() => router.push(`/account/${account.id}`)}
      {...otherProps}
    >
      <div className="flex flex-col">
        <div className="flex items-center">
          <Icon icon="folder-open" size={24} className="mr-2" />
          <div className="flex flex-col items-baseline md:flex-row">
            <H3 className="mb-0 mr-2">{account.name}</H3>
            <Text className={`mb-0 text-xs md:text-sm ${styles.muted}`}>{account.id}</Text>
          </div>
        </div>
        {account.description && <Text className={`mb-0 mt-1`}>{account.description}</Text>}
      </div>
      <div className="flex justify-end">
        <Text
          className="items-end mb-0 text-2xl font-semibold text-right md:text-3xl"
          style={{ color: balanceColor(account.balance) }}
        >
          <DollarAmount amount={account.balance} />
        </Text>
      </div>
    </Card>
  );
};

export default AccountCard;
