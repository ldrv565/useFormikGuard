import React, { useEffect, useCallback, useMemo } from "react";
import { isEmpty, isEqual } from "lodash-es";
import { FormikValues, useFormikContext } from "formik";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  styled,
  Button,
  Dialog,
  IconButton,
  Typography
} from "@material-ui/core";
import { Info, Close as CloseIcon } from "@material-ui/icons";

const InfoIconStyled = styled(Info)(({ theme }) => ({
  color: theme.palette.action.disabled,
  height: 54,
  width: 54,
  marginRight: theme.spacing()
}));

const ButtonStyled = styled(Button)({
  flex: 1,
  textTransform: "unset"
});

const DialogTitleStyled = styled(DialogTitle)({
  padding: 4
});

interface Props {
  setEditMode: (isEdit: boolean) => void;
  callback?: (...callbackArgs: any) => void;
  clearCallback: () => void;
}

export const FormikGuard: React.FC<Props> = ({
  callback,
  clearCallback,
  setEditMode
}) => {
  const {
    validateForm,
    submitForm,
    isSubmitting,
    resetForm,
    values,
    initialValues
  } = useFormikContext<FormikValues>();

  const dirty = useMemo(() => !isEqual(values, initialValues), [
    values,
    initialValues
  ]);

  useEffect(() => setEditMode(dirty), [dirty, setEditMode]);

  const onSubmit = useCallback(() => {
    submitForm()
      .then(() => validateForm())
      .then((errors) => {
        if (isEmpty(errors)) {
          callback();
        }
      })
      .then(clearCallback);
  }, [validateForm, submitForm, callback, clearCallback]);

  const onCancel = useCallback(() => {
    callback?.();
    clearCallback();
    resetForm();
  }, [callback, clearCallback, resetForm]);

  useEffect(() => {
    return () => {
      setEditMode(false);
      clearCallback();
    };
  }, [setEditMode, clearCallback]);

  const isOpen = dirty && !!callback;
  const onClose = isSubmitting ? () => null : clearCallback;

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs">
      <DialogTitleStyled>
        <Grid container justify="flex-end">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </DialogTitleStyled>
      <DialogContent dividers>
        <Grid container alignItems="center" spacing={1} wrap="nowrap">
          <Grid item>
            <InfoIconStyled />
          </Grid>
          <Grid item>
            <Typography>
              <div>Changes are not saved.</div>
              <div>Save selected changes?</div>
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <ButtonStyled
          color="primary"
          variant="outlined"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Reset
        </ButtonStyled>
        <ButtonStyled
          color="primary"
          variant="contained"
          disabled={isSubmitting}
          onClick={onSubmit}
        >
          Save
        </ButtonStyled>
      </DialogActions>
    </Dialog>
  );
};
