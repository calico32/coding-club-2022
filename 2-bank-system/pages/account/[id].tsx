import {
  Button,
  Classes,
  Colors,
  H1,
  H2,
  Icon,
  NonIdealState,
  Spinner,
  Text,
} from '@blueprintjs/core';
import type { NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React from 'react';
import AppBar from '../../components/AppBar';
import CreateTransactionDialog from '../../components/CreateTransactionDialog';
import DeleteBankAccountAlert from '../../components/DeleteBankAccountAlert';
import EditBankAccountDialog from '../../components/EditBankAccountDialog';
import TransactionCard from '../../components/TransactionCard';
import Wrapper from '../../components/Wrapper';
import { requireAuthenticated } from '../../lib/auth';
import { useAccount, useTransactions } from '../../lib/hooks';
import styles from '../../styles/util.module.scss';

export const getServerSideProps = requireAuthenticated();

const AccountPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { account, loading, mutate } = useAccount(id!.toString());
  const {
    transactions,
    loading: transactionsLoading,
    mutate: mutateTransactions,
  } = useTransactions(id!.toString());

  const [editAccountDialogOpen, setEditAccountDialogOpen] = React.useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = React.useState(false);
  const [createTransactionDialogOpen, setCreateTransactionDialogOpen] = React.useState(false);

  const transactionsLoadingClass = transactionsLoading ? Classes.SKELETON : '';

  return (
    <>
      <AppBar />
      <Wrapper>
        {loading ? (
          <NonIdealState className={styles.nonIdealState} icon={<Spinner />} />
        ) : !account ? (
          <NonIdealState
            title="Account not found"
            icon="search"
            description="The account you were looking for could not be found."
            action={
              <Button
                icon="arrow-left"
                onClick={() => Router.back()}
                intent="primary"
                text="Return"
              />
            }
          />
        ) : (
          <>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <Icon icon="folder-open" className="mr-2" size={30} />
                <H1 className="mb-0">{account.name}</H1>
              </div>
              <H1
                className="mb-0"
                style={{
                  color:
                    account.balance > 0
                      ? Colors.GREEN3
                      : account.balance < 0
                      ? Colors.RED3
                      : undefined,
                }}
              >
                {account.balance < 0 && '-'}${Math.abs(account.balance).toFixed(2)}
              </H1>
            </div>
            <Text className={`${styles.muted} text-xs`}>ID: {account.id}</Text>
            <Text className="mt-2 text-sm whitespace-pre">{account.description}</Text>

            <div className="flex items-center mt-4">
              <Button
                className="mr-2"
                icon="edit"
                text="Edit bank account"
                onClick={() => setEditAccountDialogOpen(true)}
              />
              <EditBankAccountDialog
                open={editAccountDialogOpen}
                setOpen={setEditAccountDialogOpen}
                account={account}
                callback={account => mutate({ account, status: 200 })}
              />

              <Button
                className="mr-2"
                icon="delete"
                text="Delete bank account"
                intent="danger"
                onClick={() => setDeleteAccountDialogOpen(true)}
              />
              <DeleteBankAccountAlert
                open={deleteAccountDialogOpen}
                setOpen={setDeleteAccountDialogOpen}
                account={account}
              />
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-1">
                <H2 className={transactionsLoadingClass}>Transactions</H2>

                <div className="flex items-center">
                  <Button
                    className={transactionsLoadingClass}
                    intent="success"
                    icon="add"
                    text="Create transaction"
                    onClick={() => setCreateTransactionDialogOpen(true)}
                  />
                  <CreateTransactionDialog
                    open={createTransactionDialogOpen}
                    setOpen={setCreateTransactionDialogOpen}
                    account={account!}
                    callback={() => {
                      mutate();
                      mutateTransactions();
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap">
                {transactionsLoadingClass ? (
                  <>
                    <TransactionCard skeleton className="mb-3" />
                    <TransactionCard skeleton className="mb-3" />
                    <TransactionCard skeleton className="mb-3" />
                    <TransactionCard skeleton className="mb-3" />
                  </>
                ) : (
                  [...transactions]
                    .sort(
                      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                    .map(transaction => (
                      <TransactionCard
                        key={transaction.id}
                        transaction={transaction}
                        className="mb-3"
                      />
                    ))
                )}
              </div>
            </div>
          </>
        )}
      </Wrapper>
    </>
  );
};

export default AccountPage;
