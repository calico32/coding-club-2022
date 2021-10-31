import {
  Button,
  Card,
  Classes,
  H1,
  H2,
  H3,
  Icon,
  IconName,
  MenuItem,
  Text,
} from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import type { Account } from '@prisma/client';
import type { NextPage } from 'next';
import Router from 'next/router';
import React from 'react';
import AppBar from '../components/AppBar';
import Wrapper from '../components/Wrapper';
import { requireAuthenticated } from '../lib/auth';
import { useAccounts, useUser } from '../lib/hooks';
import styles from '../styles/dashboard.module.scss';

export const getServerSideProps = requireAuthenticated();

class Sort {
  constructor(
    public name: string,
    public icon: IconName,
    public sortFunction: (a: Account, b: Account) => number
  ) {}
}

const sorts = {
  name_az: new Sort('Name (A-Z)', 'sort-alphabetical', (a, b) => a.name.localeCompare(b.name)),
  name_za: new Sort('Name (Z-A)', 'sort-alphabetical-desc', (a, b) => b.name.localeCompare(a.name)),
  balance_hl: new Sort(
    'Balance (High to low)',
    'sort-numerical-desc',
    (a, b) => b.balance - a.balance
  ),
  balance_lh: new Sort('Balance (Low to high)', 'sort-numerical', (a, b) => a.balance - b.balance),
  newest: new Sort('Newest', 'updated', (a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  oldest: new Sort('Oldest', 'outdated', (a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
  latest: new Sort('Last Updated', 'time', (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
};

const SortSelect = Select.ofType<[key: string, sort: Sort]>();

const dashboard: NextPage = () => {
  const { loading, user } = useUser();
  const { loading: accountsLoading, accounts } = useAccounts();

  const [sort, setSort] = React.useState<keyof typeof sorts>('latest');

  return (
    <>
      <AppBar />
      <Wrapper className={loading ? Classes.SKELETON : ''}>
        <H1 className="mt-4">Dashboard</H1>

        <div className="flex items-center mt-4">
          <Icon icon="user" size={24} className="mr-2" />
          <H2 className="mb-0">{user?.name}</H2>
        </div>
        <div className="flex items-center mt-1">
          <Text className={`mb-0 text-lg ${styles.muted}`}>@{user?.username}</Text>
        </div>

        <div className="flex items-center mt-4">
          <Button className="mr-2" icon="edit" text="Edit profile" />
          <Button className="mr-2" icon="delete" text="Delete account" intent="danger" />
        </div>

        <div className="mt-6">
          <div className="flex justify-between">
            <H2>Accounts</H2>

            <Select
              items={Object.entries(sorts)}
              itemRenderer={([key, sort]) => (
                <MenuItem
                  key={key}
                  text={sort.name}
                  icon={sort.icon}
                  onClick={() => setSort(key as keyof typeof sorts)}
                />
              )}
              onItemSelect={() => {}}
            >
              <Button
                icon={sorts[sort].icon}
                text={sorts[sort].name}
                rightIcon="caret-down"
                minimal
              />
            </Select>
          </div>
          <div className="flex flex-wrap">
            {[...accounts].sort(sorts[sort].sortFunction).map(account => (
              <Card
                key={account.id}
                className="flex items-center justify-between w-full p-2"
                interactive
                onClick={() => Router.push(`/account/${account.id}`)}
              >
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <Icon icon="folder-open" size={24} className="mr-2" />
                    <div className="flex items-baseline">
                      <H3 className="mb-0 mr-2">{account.name}</H3>
                      <Text className={`mb-0 text-sm ${styles.muted}`}>{account.id}</Text>
                    </div>
                  </div>
                  {account.description && (
                    <Text className={`mb-0 mt-1`}>{account.description}</Text>
                  )}
                </div>
                <div className="flex items-center">
                  <H2 className="mb-0">${account.balance.toFixed(2)}</H2>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default dashboard;
