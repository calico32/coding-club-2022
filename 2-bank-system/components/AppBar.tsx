import { AnchorButton, Button, Classes, Drawer, Icon, Navbar, Text } from '@blueprintjs/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useUser } from '../lib/hooks';
import theme from '../lib/theme';
import { useToaster } from '../lib/toaster';
import Wrapper from './Wrapper';

const AppBar: () => JSX.Element = () => {
  const router = useRouter();
  const toaster = useToaster();
  const { user, loggedOut, loading, mutate } = useUser();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
          <Button
            minimal
            icon="menu"
            onClick={() => setIsDrawerOpen(true)}
            className="flex ml-[-0.5rem] mr-2 md:hidden"
          />
          <Link href={loggedOut ? '/' : '/dashboard'}>
            <a
              className="flex items-center no-underline hover:text-current"
              style={{ color: theme.dark ? 'white' : undefined }}
            >
              <Icon
                icon="credit-card"
                size={20}
                className="mr-2"
                style={{ color: theme.dark ? 'white' : undefined }}
              ></Icon>
              <Navbar.Heading className="text-lg font-bold no-underline">dogebank</Navbar.Heading>
            </a>
          </Link>
        </Navbar.Group>

        <Drawer
          isOpen={isDrawerOpen}
          icon="user"
          title="Account"
          isCloseButtonShown={true}
          size="min-content"
          position="top"
          className={`${theme.dark ? Classes.DARK : ''} font-sans`}
          onClose={() => setIsDrawerOpen(false)}
        >
          <div className={`${Classes.DRAWER_BODY} flex flex-col`}>
            {/* <div className={`${Classes.DIALOG_BODY} flex-1`}>idk what to put here</div> */}
            <div
              className={`${Classes.DRAWER_FOOTER} flex ${
                loggedOut ? 'justify-end' : 'justify-between'
              } items-center`}
            >
              {loading ? (
                <>
                  <Button className={Classes.SKELETON} text="Loading..." />
                  <Button className={Classes.SKELETON} text="Loading..." />
                </>
              ) : loggedOut ? (
                <>
                  <Link href="/register" passHref>
                    <AnchorButton text="Register" intent="primary" outlined className="mr-2" />
                  </Link>
                  <Link href="/login" passHref>
                    <AnchorButton text="Login" intent="primary" />
                  </Link>
                </>
              ) : (
                <>
                  <Text>
                    Logged in as <b>{user?.name}</b>
                  </Text>
                  <Button
                    loading={isLoggingOut}
                    text="Logout"
                    rightIcon="log-out"
                    intent="danger"
                    onClick={logout}
                  />
                </>
              )}
            </div>
          </div>
        </Drawer>

        <Navbar.Group align="right" className="hidden md:flex">
          <Button
            className="mb-[2px] mr-3"
            icon={theme.dark ? 'lightbulb' : 'moon'}
            minimal
            onClick={() => {
              theme.dark = !theme.dark;
            }}
          />
          {loading ? (
            <>
              <Button text="Register" className={`mr-2 ${Classes.SKELETON}`} />
              <Button text="Login" className={Classes.SKELETON} />
            </>
          ) : user ? (
            <>
              <Icon icon="user" className="m-0 mr-2" />
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
