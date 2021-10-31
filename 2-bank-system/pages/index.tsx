import { Button, Classes, H1 } from '@blueprintjs/core';
import type { NextPage } from 'next';
import Router from 'next/router';
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
            <Button
              text="Go to dashboard"
              intent="primary"
              onClick={() => Router.push('/dashboard')}
            />
          ) : (
            <div className="flex">
              <Button
                text="Login"
                intent="primary"
                className="mr-2"
                onClick={() => Router.push('/login')}
              />
              <Button
                text="Register"
                intent="primary"
                outlined
                onClick={() => Router.push('/register')}
              />
            </div>
          )}
        </section>
      </Wrapper>
    </>
  );
};

export default Index;
