import { Button, Card, H1 } from '@blueprintjs/core';
import { Formik, FormikHelpers } from 'formik';
import type { NextPage } from 'next';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import AppBar from '../components/AppBar';
import BlueprintFormGroup from '../components/BlueprintFormGroup';
import Loading from '../components/Loading';
import { useUser } from '../lib/hooks';

interface RegisterValues {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const register: NextPage = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const { user, loggedOut, loading } = useUser();

  useEffect(() => {
    if (user && !loggedOut) router.replace('/dashboard');
  }, [user, loggedOut]);

  const validate = async ({ name, username, password, confirmPassword }: RegisterValues) => {
    const errors: Partial<RegisterValues> = {};

    if (!name) {
      errors.name = 'Name is required';
    }
    if (name && name.length < 3 && name.length > 100) {
      errors.name = 'Name must be between 3 and 100 characters';
    }

    if (!username) {
      errors.username = 'Username is required';
    }
    if (!/^[A-Z0-9_]{3,16}$/i.test(username)) {
      errors.username = 'Username must be 3-16 characters, alphanumeric and underscores only';
    }

    const response = await fetch(`/api/username-taken?username=${username}`);
    if ((await response.json()).taken) {
      errors.username = 'Username is already taken';
    }

    if (!password) {
      errors.password = 'Password is required';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Password confirmation is required';
    }
    if (password !== confirmPassword) {
      errors.password = 'Passwords do not match';
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const login = async (
    { name, username, password }: RegisterValues,
    formikHelpers: FormikHelpers<RegisterValues>
  ) => {
    if (isSubmitting) return;
    setSubmitting(true);

    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ name, username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      router.push('/dashboard');
    } else {
      const { message } = await response.json();
      formikHelpers.setErrors({ username: message });
    }
  };

  const initialValues: RegisterValues = {
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      <AppBar />
      <main className="mx-auto max-w-min">
        <H1 className="mt-4">Register</H1>
        <Card className="w-96">
          <Formik
            initialValues={initialValues}
            onSubmit={login}
            validate={validate}
            validateOnChange={false}
          >
            {props => (
              <form onSubmit={props.handleSubmit} className="flex flex-col" id="register">
                <BlueprintFormGroup
                  props={props}
                  property="name"
                  label="Full name"
                  labelInfo="3-100 characters"
                />
                <BlueprintFormGroup
                  props={props}
                  property="username"
                  label="Username"
                  labelInfo="3-16 characters, /[a-z0-9_]/i"
                />
                <BlueprintFormGroup
                  props={props}
                  property="password"
                  type="password"
                  label="Password"
                  labelInfo="min 8 characters"
                />
                <BlueprintFormGroup
                  props={props}
                  property="confirmPassword"
                  type="password"
                  label="Password"
                  labelInfo="(again)"
                />
                <div className="flex">
                  <Button
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    type="submit"
                    form="register"
                    text="Register"
                    intent="primary"
                    className="mr-2 max-w-min"
                  />
                  <Button
                    text="Login"
                    className="max-w-min"
                    minimal
                    onClick={() => router.push('/login')}
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

export default register;
