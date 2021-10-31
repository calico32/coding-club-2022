import { InputGroup } from '@blueprintjs/core';
import { Field, FieldProps } from 'formik';
import React from 'react';

interface BlueprintFieldProps {
  value?: string;
  name?: string;
  placeholder?: string;
  type?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const BlueprintField: React.VFC<BlueprintFieldProps> = ({
  value,
  name,
  placeholder,
  onChange,
  onBlur,
  type,
}) => {
  return (
    <Field
      name={name} //
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    >
      {(props: FieldProps) => (
        <InputGroup
          name={props.field.name}
          id={name}
          type={type}
          placeholder={placeholder}
          value={props.field.value}
          onChange={props.field.onChange}
          onBlur={props.field.onBlur}
        />
      )}
    </Field>
  );
};

export default BlueprintField;
