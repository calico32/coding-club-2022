import { Button, Classes, H1, H2, Icon, IconName, MenuItem, Text } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import type { Account } from '@prisma/client';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AppBar from '../components/AppBar';
import BankAccountCard from '../components/BankAccountCard';
import CreateBankAccountDialog from '../components/CreateBankAccountDialog';
import DeleteUserAccountAlert from '../components/DeleteUserAccountAlert';
import EditUserAccountDialog from '../components/EditUserAccountDialog';
import Loading from '../components/Loading';
import Wrapper from '../components/Wrapper';
import { useAccounts, useUser } from '../lib/hooks';
import styles from '../styles/util.module.scss';

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
  newest: new Sort(
    'Newest',
    'updated',
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ),
  oldest: new Sort(
    'Oldest',
    'outdated',
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  ),
  latest: new Sort(
    'Last Updated',
    'time',
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ),
};

const SortSelect = Select.ofType<[key: string, sort: Sort]>();

const dashboard: NextPage = () => {
  const router = useRouter();
  const { loading, user, mutate, loggedOut } = useUser();
  const { loading: accountsLoading, accounts } = useAccounts();

  useEffect(() => {
    if (loggedOut)
      router.replace({
        pathname: '/login',
        query: { from: router.asPath },
      });
  }, [loggedOut]);

  const [sort, setSort] = useState<keyof typeof sorts>('latest');

  const [editProfileDialogOpen, setEditProfileDialogOpen] = useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const [createAccountDialogOpen, setCreateAccountDialogOpen] = useState(false);

  const userLoadingClass = loading ? Classes.SKELETON : '';
  const accountsLoadingClass = accountsLoading ? Classes.SKELETON : '';

  return loading ? (
    <Loading />
  ) : (
    <>
      <AppBar />
      <Wrapper>
        <div className="flex items-center mt-4">
          <Icon icon="user" size={32} className="mr-2" />
          <H1 className={`mb-0 ${userLoadingClass} mr-2`}>{user?.name}</H1>
          <Text className={`mb-0 mt-1 text-xl ${styles.muted}`}>
            @<span className={userLoadingClass}>{user?.username}</span>
          </Text>
        </div>

        <Text className={`mb-0 mt-1 text-sm ${styles.muted}`}>
          <span className={userLoadingClass}>ID: {user?.id}</span>
        </Text>

        <div className="flex items-center mt-4">
          <Button
            className={`mr-2 ${userLoadingClass}`}
            icon="edit"
            text="Edit profile"
            onClick={() => setEditProfileDialogOpen(true)}
          />
          <EditUserAccountDialog
            open={editProfileDialogOpen}
            setOpen={setEditProfileDialogOpen}
            user={user!}
            callback={user => mutate({ user, status: 200 })}
          />

          <Button
            className={`mr-2 ${userLoadingClass}`}
            icon="delete"
            text="Delete account"
            intent="danger"
            onClick={() => setDeleteAccountDialogOpen(true)}
          />
          <DeleteUserAccountAlert
            open={deleteAccountDialogOpen}
            setOpen={setDeleteAccountDialogOpen}
          />
        </div>

        <div className="mt-6">
          <div className="flex flex-col items-stretch justify-between mb-1 md:items-center md:flex-row">
            <H2 className={`${accountsLoadingClass} mb-1`}>Accounts</H2>

            <div className="flex flex-row-reverse justify-between mb-1 md:flex-row md:justify-start md:items-center md:mb-0">
              <SortSelect
                className={`${accountsLoadingClass} md:mr-2 mr-0`}
                filterable={false}
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
                  className={accountsLoadingClass}
                  icon={sorts[sort].icon}
                  text={sorts[sort].name}
                  rightIcon="caret-down"
                  minimal
                />
              </SortSelect>
              <Button
                className={accountsLoadingClass}
                intent="success"
                icon="add"
                text="Create new account"
                onClick={() => setCreateAccountDialogOpen(true)}
              />
              <CreateBankAccountDialog
                open={createAccountDialogOpen}
                setOpen={setCreateAccountDialogOpen}
              />
            </div>
          </div>
          <div className="flex flex-wrap">
            {accountsLoadingClass ? (
              <>
                <BankAccountCard skeleton className="mb-3" />
                <BankAccountCard skeleton className="mb-3" />
                <BankAccountCard skeleton className="mb-3" />
                <BankAccountCard skeleton className="mb-3" />
              </>
            ) : (
              [...accounts]
                .sort(sorts[sort].sortFunction)
                .map(account => (
                  <BankAccountCard key={account.id} account={account} className="mb-3" />
                ))
            )}
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default dashboard;
