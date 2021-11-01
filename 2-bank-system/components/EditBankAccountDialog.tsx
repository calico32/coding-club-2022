import { Button, Classes, Dialog } from '@blueprintjs/core';
import { Account } from '@prisma/client';
import { Formik, FormikHelpers } from 'formik';
import React from 'react';
import { useToaster } from '../lib/toaster';
import BlueprintFormGroup from './BlueprintFormGroup';

interface EditBankAccountDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  account: Account;
  callback?: (account: Account) => any;
}

interface EditBankAccountValues {
  name?: string;
  description?: string;
}

const EditBankAccountDialog = ({
  open,
  setOpen,
  account,
  callback,
}: EditBankAccountDialogProps): JSX.Element => {
  const toaster = useToaster();

  const editProfileInitialValues: EditBankAccountValues = {
    name: account.name,
    description: account.description ?? '',
  };

  const patchUser = async (
    values: EditBankAccountValues,
    { setSubmitting }: FormikHelpers<EditBankAccountValues>
  ) => {
    if (values.name === account.name) {
      delete values.name;
    }
    if (values.description === account.description) {
      delete values.description;
    }

    if (Object.keys(values).length === 0) {
      setSubmitting(false);
      setOpen(false);
      return;
    }

    const response = await fetch(`/api/account/${account.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: values.name,
        description: values.description ? values.description : '',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      toaster.show({ message: 'Account saved', intent: 'success', icon: 'tick' });
      setOpen(false);
      callback && callback((await response.json()).account);
    } else {
      const message = (await response.json()).message;
      toaster.show({ message, intent: 'danger', icon: 'error' });
    }

    setSubmitting(false);
  };

  const validate = async (values: EditBankAccountValues) => {
    const errors: Partial<typeof values> = {};

    if (!values.name) {
      errors.name = 'Name is required';
    }
    // check name between 3 and 100 chars
    else if (values.name.length < 3 || values.name.length > 100) {
      errors.name = 'Name must be between 3 and 100 characters';
    }

    // check description less than 500 chars
    if (values.description && values.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    return errors;
  };

  return (
    <Dialog
      isOpen={open}
      onClose={() => setOpen(false)}
      icon="edit"
      title="Edit Bank Account"
      className="pb-0"
    >
      <div className={Classes.DIALOG_BODY}>
        <Formik
          initialValues={editProfileInitialValues}
          onSubmit={patchUser}
          validate={validate}
          validateOnChange
        >
          {props => (
            <form onSubmit={props.handleSubmit}>
              <BlueprintFormGroup
                props={props}
                property="name"
                label="Name"
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

export default EditBankAccountDialog;
