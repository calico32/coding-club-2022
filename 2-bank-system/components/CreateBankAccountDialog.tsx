import { Button, Classes, Dialog } from '@blueprintjs/core';
import { Account } from '@prisma/client';
import { Formik, FormikHelpers } from 'formik';
import Router from 'next/router';
import React from 'react';
import { useToaster } from '../lib/toaster';
import BlueprintFormGroup from './BlueprintFormGroup';

interface CreateAccountDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  callback?: (user: Account) => any;
}

interface CreateAccountValues {
  name: string;
  description?: string;
}

const CreateAccountDialog: React.VFC<CreateAccountDialogProps> = ({ open, setOpen, callback }) => {
  const toaster = useToaster();

  const editProfileInitialValues: CreateAccountValues = {
    name: '',
    description: '',
  };

  const patchUser = async (
    values: CreateAccountValues,
    { setSubmitting }: FormikHelpers<CreateAccountValues>
  ) => {
    if (values.description === '') {
      delete values.description;
    }

    const response = await fetch('/api/account', {
      method: 'POST',
      body: JSON.stringify({
        name: values.name,
        description: values.description,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const account: Account = (await response.json()).account;
      setOpen(false);
      Router.push(`/account/${account.id}`);
      toaster.show({ message: 'Account created', intent: 'success', icon: 'tick' });
      callback && callback(account);
    } else {
      const message = (await response.json()).message;
      toaster.show({ message, intent: 'danger', icon: 'error' });
    }

    setSubmitting(false);
  };

  const validate = async (values: CreateAccountValues) => {
    const errors: Partial<typeof values> = {};

    // check if name is empty
    if (!values.name) {
      errors.name = 'Name is required';
    }
    // check if name is 3 to 100 characters
    else if (values.name.length < 3 || values.name.length > 100) {
      errors.name = 'Name must be between 3 and 100 characters';
    }

    // check if description is less than 500 characters
    if (values.description && values.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    return errors;
  };

  return (
    <Dialog
      isOpen={open}
      onClose={() => setOpen(false)}
      icon="add"
      title="Create Bank Account"
      className="pb-0"
    >
      <div className={Classes.DIALOG_BODY}>
        <Formik initialValues={editProfileInitialValues} onSubmit={patchUser} validate={validate}>
          {props => (
            <form onSubmit={props.handleSubmit}>
              <BlueprintFormGroup
                props={props}
                property="name"
                label="Account Name"
                labelInfo="3-100 characters"
              />
              <BlueprintFormGroup
                props={props}
                property="description"
                label="Description"
                labelInfo="optional, ≤ 500 characters"
                textarea
              />

              <div className={`mr-0 ${Classes.DIALOG_FOOTER}`}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                  <Button
                    text="Cancel"
                    onClick={() => {
                      setOpen(false);
                    }}
                  />
                  <Button intent="primary" text="Save" type="submit" />
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </Dialog>
  );
};

export default CreateAccountDialog;
