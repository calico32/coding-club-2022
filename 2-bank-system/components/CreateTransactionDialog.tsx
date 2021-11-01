import { Button, Classes, Dialog } from '@blueprintjs/core';
import { Account, Transaction } from '@prisma/client';
import { Formik, FormikHelpers } from 'formik';
import React from 'react';
import { useToaster } from '../lib/toaster';
import BlueprintFormGroup from './BlueprintFormGroup';

interface CreateTransactionDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  callback?: (transaction: Transaction) => any;
  account: Account;
}

interface CreateTransactionValues {
  description?: string;
  amount: string;
}

const CreateTransactionDialog: React.VFC<CreateTransactionDialogProps> = ({
  open,
  setOpen,
  callback,
  account,
}) => {
  const toaster = useToaster();

  const initialValues: CreateTransactionValues = {
    description: '',
    amount: '',
  };

  const putTransaction = async (
    values: CreateTransactionValues,
    { setSubmitting }: FormikHelpers<CreateTransactionValues>
  ) => {
    if (values.description === '') {
      delete values.description;
    }

    const response = await fetch(`/api/account/${account.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        amount: parseFloat(parseFloat(values.amount).toFixed(2)),
        description: values.description || undefined,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const transaction: Transaction = (await response.json()).transaction;
      setOpen(false);
      toaster.show({ message: 'Transaction completed', intent: 'success', icon: 'tick' });
      callback && callback(transaction);
    } else {
      const message = (await response.json()).message;
      toaster.show({ message, intent: 'danger', icon: 'error' });
    }

    setSubmitting(false);
  };

  const validate = async (values: CreateTransactionValues) => {
    const errors: Partial<Record<keyof typeof values, string>> = {};

    // check if description is over 100 chars
    if (values.description && values.description.length > 100) {
      errors.description = 'Description must be less than 100 characters';
    }

    // check if amount is only digits and . and -
    if (values.amount && !/^[0-9.-]*$/.test(values.amount)) {
      errors.amount = 'Amount must be a number';
    }

    // check amount is a number
    if (isNaN(parseFloat(values.amount))) {
      errors.amount = 'Amount must be a number';
    }

    // check if amount is 0
    if (parseFloat(values.amount) === 0) {
      errors.amount = 'Amount cannot be zero';
    }

    // check number of decimal places in amount
    if (
      values.amount &&
      values.amount.toString().split('.')[1] &&
      values.amount.toString().split('.')[1].length > 2
    ) {
      errors.amount = 'Amount must have no more than 2 decimal places';
    }

    return errors;
  };

  return (
    <Dialog
      isOpen={open}
      onClose={() => setOpen(false)}
      icon="dollar"
      title="Create Transaction"
      className="pb-0"
    >
      <div className={Classes.DIALOG_BODY}>
        <Formik initialValues={initialValues} onSubmit={putTransaction} validate={validate}>
          {props => (
            <form onSubmit={props.handleSubmit}>
              <BlueprintFormGroup
                props={props}
                property="amount"
                label="Amount"
                leftIcon="dollar"
                intent={
                  parseFloat(props.values.amount || '0') === 0
                    ? undefined
                    : parseFloat(props.values.amount) > 0
                    ? 'success'
                    : 'danger'
                }
              />
              <BlueprintFormGroup
                props={props}
                property="description"
                label="Memo"
                labelInfo="optional, ≤ 100 characters"
              />

              <div className={`mr-0 ${Classes.DIALOG_FOOTER}`}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                  <Button
                    text="Cancel"
                    onClick={() => {
                      setOpen(false);
                    }}
                  />
                  <Button
                    intent="success"
                    text="Create"
                    type="submit"
                    loading={props.isSubmitting}
                  />
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </Dialog>
  );
};

export default CreateTransactionDialog;
