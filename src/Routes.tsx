import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import {
  Dialog,
  Button,
  DialogContent,
  DialogActions,
  Grid
} from "@material-ui/core";
import { useFormikGuard } from "./useFormikGuard";
import { Formik, Form, Field } from "formik";
import { FormTextField } from "./FormTextField";
import * as Yup from "yup";

const schema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required")
});

export const Routes = () => {
  const [isOpen, setOpen] = useState(false);
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const guard = useFormikGuard();

  return (
    <div>
      <Switch>
        <Route path="/">
          <Button variant="outlined" color="secondary" onClick={onOpen}>
            Open modal form
          </Button>
          <Dialog open={isOpen} onClose={guard.protectFrom(onClose)}>
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: ""
              }}
              onSubmit={async (values) => {
                await new Promise((r) => setTimeout(r, 500));
                alert(JSON.stringify(values, null, 2));
              }}
              validationSchema={schema}
            >
              <Form noValidate>
                <DialogContent>
                  <Grid container direction="column">
                    <Field
                      required
                      name="firstName"
                      label="firstName"
                      placeholder="Jane"
                      component={FormTextField}
                    />
                    <Field
                      required
                      name="lastName"
                      label="lastName"
                      placeholder="Doe"
                      component={FormTextField}
                    />
                    <Field
                      required
                      name="email"
                      label="email"
                      placeholder="jane@acme.com"
                      component={FormTextField}
                    />
                  </Grid>
                </DialogContent>

                <DialogActions>
                  <Button color="primary" variant="contained" type="submit">
                    Submit
                  </Button>
                </DialogActions>
                {guard.render()}
              </Form>
            </Formik>
          </Dialog>
        </Route>
      </Switch>
    </div>
  );
};
