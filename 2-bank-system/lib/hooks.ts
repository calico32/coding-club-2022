import type { Account, Transaction, User } from '@prisma/client';
import useSWR from 'swr';

const fetcher = async (url: string) => {
  const r = await fetch(url);
  const data = await r.json();
  return { ...data, status: r.status };
};

type Response = { status: number };
type ErrorResponse = Response & { message: string };

type UserResponse = Response & { user: User };

export const useUser = () => {
  const { data, error, mutate } = useSWR<UserResponse, ErrorResponse>('/api/user', fetcher);

  const loading = !data && !error;
  const loggedOut = data && !data?.user && !error;

  return {
    loading,
    loggedOut,
    user: data?.user,
    mutate,
  };
};

type AccountsResponse = Response & { accounts: Account[] };

export const useAccounts = () => {
  const { data, error, mutate } = useSWR<AccountsResponse, ErrorResponse>('/api/accounts', fetcher);

  const loading = !data && !error;
  const accounts = data?.accounts ?? [];

  return {
    loading,
    accounts,
    mutate,
  };
};

type AccountResponse = Response & { account: Account };

export const useAccount = (id: string) => {
  const { data, error, mutate } = useSWR<AccountResponse, ErrorResponse>(
    `/api/account/${id}`,
    fetcher
  );

  const loading = !data && !error;
  const account = data?.account;

  return {
    loading,
    account,
    mutate,
  };
};

type TransactionsResponse = Response & { transactions: Transaction[] };

export const useTransactions = (accountId: string) => {
  const { data, error, mutate } = useSWR<TransactionsResponse, ErrorResponse>(
    `/api/transactions/${accountId}`,
    fetcher
  );

  const loading = !data && !error;
  const transactions = data?.transactions ?? [];

  return {
    loading,
    transactions,
    mutate,
  };
};
