import { AnchorButton, Button, Classes, Icon, Navbar, Text } from '@blueprintjs/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useUser } from '../lib/hooks';
import { useToaster } from '../lib/toaster';
import Wrapper from './Wrapper';

const AppBar: () => JSX.Element = () => {
  const router = useRouter();
  const toaster = useToaster();
  const { user, loggedOut, loading, mutate } = useUser();

  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const logout = async () => {
    setIsLoggingOut(true);

    await fetch('/api/logout', { method: 'POST' });

    await router.push('/');

    mutate();

    toaster.show({
      message: 'Successfully logged out.',
      intent: 'success',
      icon: 'tick',
    });

    setIsLoggingOut(false);
  };

  return (
    <Navbar className="px-0">
      <Wrapper width="1024px">
        <Navbar.Group align="left">
          <Link href={loggedOut ? '/' : '/dashboard'}>
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
              <Button
                loading={isLoggingOut}
                text="Logout"
                rightIcon="log-out"
                intent="danger"
                onClick={logout}
              />
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
