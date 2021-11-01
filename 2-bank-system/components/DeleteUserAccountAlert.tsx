import { Alert, Text } from '@blueprintjs/core';
import React from 'react';
import { useToaster } from '../lib/toaster';

interface DeleteUserAccountAlertProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  callback?: () => any;
}

const DeleteUserAccountAlert: React.VFC<DeleteUserAccountAlertProps> = ({
  open,
  setOpen,
  callback,
}) => {
  const toaster = useToaster();
  const [loading, setLoading] = React.useState(false);

  return (
    <Alert
      cancelButtonText="Cancel"
      confirmButtonText="I'm sure, delete my user account"
      icon="delete"
      intent="danger"
      isOpen={open}
      loading={loading}
      onCancel={() => setOpen(false)}
      onConfirm={async () => {
        setLoading(true);
        try {
          await fetch('/api/user', { method: 'DELETE' });
          toaster.show({
            icon: 'tick',
            intent: 'success',
            message: 'Account successfully deleted.',
            timeout: 5000,
          });
          setOpen(false);
          window.location.href = '/';
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
        Are you sure you want to delete your account?{' '}
        <b>All associated bank accounts will be deleted. This action cannot be undone.</b>
      </Text>
    </Alert>
  );
};

export default DeleteUserAccountAlert;
