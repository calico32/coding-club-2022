import { IconName, InputGroup, Intent, NumericInput, TextArea } from '@blueprintjs/core';
import { Field, FieldProps } from 'formik';
import React from 'react';

interface BlueprintFieldProps {
  value?: string;
  name?: string;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  numeric?: boolean;
  leftIcon?: IconName;
  intent?: Intent;
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
  textarea,
  numeric,
  leftIcon,
  intent,
  ...props
}) => {
  if (textarea && numeric) {
    throw new Error('BlueprintField cannot be both textarea and numeric');
  }

  return (
    <Field
      name={name} //
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    >
      {(props: FieldProps) =>
        textarea ? (
          <TextArea
            name={props.field.name}
            id={name}
            itemType={type}
            placeholder={placeholder}
            value={props.field.value}
            onChange={props.field.onChange}
            onBlur={props.field.onBlur}
            fill
            rows={7}
            intent={intent}
          />
        ) : numeric ? (
          <NumericInput
            name={props.field.name}
            id={name}
            type={type}
            placeholder={placeholder}
            value={props.field.value}
            onChange={props.field.onChange}
            onBlur={props.field.onBlur}
            allowNumericCharactersOnly={false}
            leftIcon={leftIcon}
            fill
            buttonPosition="none"
            minorStepSize={0.01}
            intent={intent}
          />
        ) : (
          <InputGroup
            name={props.field.name}
            id={name}
            type={type}
            placeholder={placeholder}
            leftIcon={leftIcon}
            value={props.field.value}
            onChange={props.field.onChange}
            onBlur={props.field.onBlur}
            intent={intent}
          />
        )
      }
    </Field>
  );
};

export default BlueprintField;
