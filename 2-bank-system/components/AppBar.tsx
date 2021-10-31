import { AnchorButton, Button, Classes, Icon, Navbar, Text } from '@blueprintjs/core';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';
import { useUser } from '../lib/hooks';
import Wrapper from './Wrapper';

const AppBar: () => JSX.Element = () => {
  const { user, loggedOut, loading } = useUser();

  const logout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });

    Router.replace('/');
  };

  return (
    <Navbar className="px-0">
      <Wrapper width="1024px">
        <Navbar.Group align="left">
          <Link href="/">
            <a className="flex items-center no-underline hover:text-current">
              <Icon icon="credit-card" size={20} className="mr-2"></Icon>
              <Navbar.Heading className="text-lg font-bold no-underline">dogebank</Navbar.Heading>
            </a>
          </Link>
        </Navbar.Group>

        <Navbar.Group align="right">
          {loading ? (
            <>
              <Button text="Register" className={`mr-2 ${Classes.SKELETON}`} />
              <Button text="Login" className={Classes.SKELETON} />
            </>
          ) : user ? (
            <>
              <Icon icon="user" className="mr-2" />
              <Text className="mr-4">
                Logged in as <b>{user.name}</b>
              </Text>
              <Button text="Logout" rightIcon="log-out" intent="danger" onClick={logout} />
            </>
          ) : (
            <>
              <Link href="/register" passHref>
                <AnchorButton text="Register" intent="primary" outlined className="mr-2" />
              </Link>
              <Link href="/login" passHref>
                <AnchorButton text="Login" intent="primary" />
              </Link>
            </>
          )}
        </Navbar.Group>
      </Wrapper>
    </Navbar>
  );
};

export default AppBar;
