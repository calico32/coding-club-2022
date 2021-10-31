import { Button, H2, Icon, NonIdealState, Spinner } from '@blueprintjs/core';
import type { NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React from 'react';
import AppBar from '../../components/AppBar';
import Wrapper from '../../components/Wrapper';
import { requireAuthenticated } from '../../lib/auth';
import { useAccount } from '../../lib/hooks';
import styles from '../../styles/account.module.scss';

export const getServerSideProps = requireAuthenticated();

const AccountPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { account, loading } = useAccount(id!.toString());

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
            <div className="flex items-center mt-4">
              <Icon icon="folder-open" className="mr-2" size={24} />
              <H2 className="mb-0">{account.name}</H2>
            </div>
          </>
        )}
      </Wrapper>
    </>
  );
};

export default AccountPage;
