import { Card, Classes, Colors, H2, H3, HTMLDivProps, Icon, Text } from '@blueprintjs/core';
import { Account } from '@prisma/client';
import { useRouter } from 'next/router';
import React from 'react';
import styles from '../styles/util.module.scss';

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
      className={`flex items-center justify-between w-full p-2 ${
        skeleton ? Classes.SKELETON : ''
      } ${className}`}
      interactive
      onClick={() => router.push(`/account/${account.id}`)}
      {...otherProps}
    >
      <div className="flex flex-col">
        <div className="flex items-center">
          <Icon icon="folder-open" size={24} className="mr-2" />
          <div className="flex items-baseline">
            <H3 className="mb-0 mr-2">{account.name}</H3>
            <Text className={`mb-0 text-sm ${styles.muted}`}>{account.id}</Text>
          </div>
        </div>
        {account.description && <Text className={`mb-0 mt-1`}>{account.description}</Text>}
      </div>
      <div className="flex items-center">
        <H2
          className="mb-0"
          style={{
            color:
              account.balance > 0 ? Colors.GREEN3 : account.balance < 0 ? Colors.RED3 : undefined,
          }}
        >
          {account.balance < 0 && '-'}${Math.abs(account.balance).toFixed(2)}
        </H2>
      </div>
    </Card>
  );
};

export default AccountCard;
