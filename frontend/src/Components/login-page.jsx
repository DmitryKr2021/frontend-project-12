import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
//import * as Yup from 'yup';

const SignupForm = () => {
  return (
    <>
      <Formik
        initialValues={{ login: "", password: "" }}
        onSubmit={({ setSubmitting }) => {
          console.log("Form is validated! Submitting the form...");
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="login">Login</label>
              <Field type="text" name="login" className="form-control" />
              <ErrorMessage name="login" component="div" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" className="form-control" />
              <ErrorMessage name="password" component="div" />
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SignupForm;
