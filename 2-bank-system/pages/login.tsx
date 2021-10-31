import { Button, Callout, Card, H1 } from '@blueprintjs/core';
import { Formik, FormikHelpers } from 'formik';
import { NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import React, { useState } from 'react';
import AppBar from '../components/AppBar';
import BlueprintFormGroup from '../components/BlueprintFormGroup';
import { requireUnauthenticated } from '../lib/auth';

interface LoginValues {
  username: string;
  password: string;
}

export const getServerSideProps = requireUnauthenticated();

const Login: NextPage = () => {
  const router = useRouter();

  const from = router.query.from?.toString() ?? '';
  const fromProtected = from.startsWith('dashboard') || from.startsWith('account');

  const [isSubmitting, setSubmitting] = useState(false);

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
    formikHelpers: FormikHelpers<LoginValues>
  ) => {
    if (isSubmitting) return;
    setSubmitting(true);

    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      Router.push(`/${from}` ?? '/dashboard');
    } else {
      const { error } = await response.json();
      formikHelpers.setErrors({ username: error });
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
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    type="submit"
                    form="login"
                    text="Login"
                    intent="primary"
                    className="max-w-min"
                  />
                  <Button
                    text="Register"
                    className="max-w-min"
                    minimal
                    onClick={() => Router.push('/register')}
                  />
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
