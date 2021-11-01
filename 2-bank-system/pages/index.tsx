import { AnchorButton, Button, Classes, H1 } from '@blueprintjs/core';
import type { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import AppBar from '../components/AppBar';
import Wrapper from '../components/Wrapper';
import { useUser } from '../lib/hooks';
import styles from '../styles/index.module.scss';

const Index: NextPage = () => {
  const { user, loading } = useUser();

  return (
    <>
      <AppBar />
      <Wrapper>
        <section className={`flex flex-col items-center justify-center w-full ${styles.hero}`}>
          <H1>dogebank</H1>
          {loading ? (
            <Button text="Go to dashboard" disabled className={Classes.SKELETON} />
          ) : user ? (
            <Link href="/dashboard" passHref>
              <AnchorButton text="Go to dashboard" intent="primary" />
            </Link>
          ) : (
            <div className="flex">
              <Link href="/login" passHref>
                <AnchorButton text="Login" intent="primary" className="mr-2" />
              </Link>
              <Link href="/register" passHref>
                <AnchorButton text="Register" intent="primary" outlined />
              </Link>
            </div>
          )}
        </section>
      </Wrapper>
    </>
  );
};

export default Index;
