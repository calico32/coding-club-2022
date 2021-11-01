import { AnchorButton, Button, Callout, Card, H1 } from '@blueprintjs/core';
import { Formik, FormikHelpers } from 'formik';
import { NextPage } from 'next';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import React from 'react';
import AppBar from '../components/AppBar';
import BlueprintFormGroup from '../components/BlueprintFormGroup';
import { requireUnauthenticated } from '../lib/auth';
import { useToaster } from '../lib/toaster';

interface LoginValues {
  username: string;
  password: string;
}

export const getServerSideProps = requireUnauthenticated();

const Login: NextPage = () => {
  const router = useRouter();
  const toaster = useToaster();

  const from = router.query.from?.toString() ?? '';
  const fromProtected = from.startsWith('dashboard') || from.startsWith('account');

  const validate = ({ username, password }: LoginValues) => {
    const errors: Partial<LoginValues> = {};

    if (!username) {
      errors.username = 'Username is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const login = async (
    { username, password }: LoginValues,
    { setSubmitting }: FormikHelpers<LoginValues>
  ) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const useFrom = from && (from.startsWith('account') || from.startsWith('dashboard'));
      Router.push(useFrom ? `/${from}` : '/dashboard');
      toaster.show({
        message: 'Successfully logged in.',
        intent: 'success',
        icon: 'tick',
      });
      setSubmitting(false);
    } else {
      const { message } = await response.json();
      toaster.show({
        message,
        intent: 'danger',
        icon: 'error',
      });
      setSubmitting(false);
    }
  };

  const initialValues: LoginValues = {
    username: '',
    password: '',
  };

  return (
    <>
      <AppBar />
      <main className="mx-auto max-w-min">
        {fromProtected && (
          <Callout intent="primary" className="mt-4">
            Please log in first.
          </Callout>
        )}
        <H1 className="mt-4">Login</H1>
        <Card className="w-96">
          <Formik initialValues={initialValues} onSubmit={login} validate={validate}>
            {props => (
              <form onSubmit={props.handleSubmit} className="flex flex-col" id="login">
                <BlueprintFormGroup props={props} property="username" placeholder="Username" />
                <BlueprintFormGroup
                  props={props}
                  property="password"
                  type="password"
                  placeholder="Password"
                />
                <div className="flex">
                  <Button
                    loading={props.isSubmitting}
                    type="submit"
                    form="login"
                    text="Login"
                    intent="primary"
                    className="mr-2 max-w-min"
                  />
                  <Link href="/register" passHref>
                    <AnchorButton text="Register" className="max-w-min" minimal />
                  </Link>
                </div>
              </form>
            )}
          </Formik>
        </Card>
      </main>
    </>
  );
};

export default Login;
