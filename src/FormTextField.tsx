import React from "react";
import { FieldProps } from "formik";
import { TextField, StandardTextFieldProps } from "@material-ui/core";

export interface FormTextFieldProps
  extends StandardTextFieldProps,
    Omit<FieldProps, "meta"> {
  defaultValue?: unknown;
}
const FormTextField: React.FC<FormTextFieldProps> = ({
  field,
  form,
  defaultValue = "",
  ...textFieldProps
}) => {
  const { getFieldMeta } = form;
  const meta = getFieldMeta(field.name);
  const error = meta.error;
  const hasError = meta.touched && !!error;

  return (
    <TextField
      {...field}
      {...textFieldProps}
      value={field.value ?? ""}
      error={hasError}
      helperText={hasError && error}
    />
  );
};

export { FormTextField };
