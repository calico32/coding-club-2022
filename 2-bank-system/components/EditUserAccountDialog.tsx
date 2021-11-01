import { Button, Classes, Dialog, H4, Icon } from '@blueprintjs/core';
import { User } from '@prisma/client';
import { Formik, FormikHelpers } from 'formik';
import React from 'react';
import { useToaster } from '../lib/toaster';
import BlueprintFormGroup from './BlueprintFormGroup';

interface EditProfileDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  callback: (user: User) => any;
}

interface EditProfileValues {
  name?: string;
  username?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const EditProfileDialog = ({
  open,
  setOpen,
  user,
  callback,
}: EditProfileDialogProps): JSX.Element => {
  const toaster = useToaster();

  const editProfileInitialValues: EditProfileValues = {
    name: user?.name,
    username: user?.username,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const patchUser = async (
    values: EditProfileValues,
    { setSubmitting }: FormikHelpers<EditProfileValues>
  ) => {
    if (values.name === user?.name) {
      delete values.name;
    }
    if (values.username === user?.username) {
      delete values.username;
    }
    if (values.newPassword === '') {
      delete values.newPassword;
    }
    if (values.currentPassword === '') {
      delete values.currentPassword;
    }
    if (values.confirmPassword === '') {
      delete values.confirmPassword;
    }

    if (Object.keys(values).length === 0) {
      setSubmitting(false);
      setOpen(false);
      return;
    }

    const response = await fetch('/api/user', {
      method: 'PATCH',
      body: JSON.stringify({
        name: values.name,
        username: values.username,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      callback((await response.json()).user);
      toaster.show({ message: 'Profile saved', intent: 'success', icon: 'tick' });
      setOpen(false);
    } else {
      const message = (await response.json()).message;
      toaster.show({ message, intent: 'danger', icon: 'error' });
    }

    setSubmitting(false);
  };

  const validate = async (values: EditProfileValues) => {
    const errors: Partial<typeof values> = {};

    // check name between 3 and 100 chars
    if (values.name && (values.name.length < 3 || values.name.length > 100)) {
      errors.name = 'Name must be between 3 and 100 characters';
    }

    // check username between 3 and 16
    if (values.username && (values.username.length < 3 || values.username.length > 16)) {
      errors.username = 'Username must be between 3 and 16 characters';
    }

    // check username taken
    if (values.username && values.username !== user?.username) {
      const response = await fetch(`/api/user/username/${values.username}`);
      if (response.ok && (await response.json()).taken) {
        errors.username = 'Username is taken';
      }
    }

    if (values.newPassword && values.currentPassword === '') {
      errors.currentPassword = 'Current password is required';
    }

    if (values.newPassword && values.newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters';
    }

    if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  return (
    <Dialog
      isOpen={open}
      onClose={() => setOpen(false)}
      icon="edit"
      title="Edit Profile"
      className="pb-0"
    >
      <div className={Classes.DIALOG_BODY}>
        <Formik initialValues={editProfileInitialValues} onSubmit={patchUser} validate={validate}>
          {props => (
            <form onSubmit={props.handleSubmit}>
              <BlueprintFormGroup props={props} property="name" label="Name" />
              <BlueprintFormGroup
                props={props}
                property="username"
                label="Username"
                labelInfo="3-16 charsacters, /[a-z0-9_]/i"
              />

              <div className="flex items-center mt-3 mb-2">
                <Icon icon="lock" size={20} />
                <H4 className="my-0 ml-2">Change Password</H4>
              </div>
              <BlueprintFormGroup
                props={props}
                property="currentPassword"
                type="password"
                label="Current Password"
                helperText={
                  props.touched.newPassword
                    ? props.errors.currentPassword
                      ? props.errors.currentPassword
                      : undefined
                    : undefined
                }
              />
              <BlueprintFormGroup
                props={props}
                property="newPassword"
                type="password"
                label="New Password"
                labelInfo="min 8 chars"
              />
              <BlueprintFormGroup
                props={props}
                property="confirmPassword"
                type="password"
                label="New Password"
                labelInfo="(again)"
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

export default EditProfileDialog;
