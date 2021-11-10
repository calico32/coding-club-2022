import { Alert, Text } from '@blueprintjs/core';
import { Account } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useToaster } from '../lib/toaster';

interface DeleteBankAccountAlertProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  callback?: () => any;
  account: Account;
}

const DeleteBankAccountAlert: React.VFC<DeleteBankAccountAlertProps> = ({
  open,
  setOpen,
  callback,
  account,
}) => {
  const router = useRouter();
  const toaster = useToaster();
  const [loading, setLoading] = useState(false);

  return (
    <Alert
      cancelButtonText="Cancel"
      confirmButtonText="I'm sure, delete bank account"
      icon="delete"
      intent="danger"
      isOpen={open}
      loading={loading}
      onCancel={() => setOpen(false)}
      onConfirm={async () => {
        setLoading(true);
        try {
          await fetch(`/api/account/${account.id}`, { method: 'DELETE' });
          toaster.show({
            icon: 'tick',
            intent: 'success',
            message: (
              <>
                Account <b>{account.name}</b> successfully deleted.
              </>
            ),
            timeout: 5000,
          });
          setOpen(false);
          router.push('/dashboard');
          callback && callback();
        } catch (err) {
          toaster.show({
            icon: 'error',
            intent: 'danger',
            message: err.message,
          });
        } finally {
          setLoading(false);
        }
      }}
    >
      <Text>
        Are you sure you want to delete <b>{account.name}</b>? <b>This action cannot be undone.</b>
      </Text>
    </Alert>
  );
};

export default DeleteBankAccountAlert;
