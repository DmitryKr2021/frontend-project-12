import React, { useRef } from 'react';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/index.jsx';
import img from '../imgs/registration.png';

const RegistrationPage = () => {
  const { t } = useTranslation();
  const loginLength = t('errors.loginLength');
  const passwordLength = t('errors.passwordLength');
  const required = t('errors.required');
  const coincidePass = t('errors.coincidePass');
  const toRegister = t('registration.toRegister');
  const username = t('registration.username');
  const password = t('registration.password');
  const repeatPassword = t('registration.repeatPassword');
  const registration = t('registration.registration');
  const navigate = useNavigate();
  const auth = useAuth();
  const inpRepeat = useRef();

  const Schema = Yup.object().shape({
    username: Yup.string()
      .min(3, loginLength)
      .max(20, loginLength)
      .required(required),
    password: Yup.string()
      .min(6, passwordLength)
      .max(20, passwordLength)
      .required(required),
    repeatPassword: Yup.string()
      .required(required)
      .oneOf([Yup.ref('password'), null], coincidePass),
  });

  return (
    <Formik
      initialValues={{ username: '', password: '', repeatPassword: '' }}
      validationSchema={Schema}
      onSubmit={(values) => {
        axios
          .post('/api/v1/signup', {
            username: values.username,
            password: values.password,
          })
          .then((response) => {
            window.localStorage.setItem('user', JSON.stringify(response.data));
            auth.logIn();
            navigate('/main');
          })
          .catch((error) => {
            if (error.response) {
              navigate('/conflict');
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            }
          });
      }}
    >
      {({
        values,
        handleChange,
        isSubmitting,
        handleSubmit,
        handleBlur,
        errors,
        touched,
      }) => (
        <div className="d-flex flex-column">
          <div className="container-fluid h-100">
            <div
              className="row justify-content-center align-content-center h-100"
              style={{ marginTop: 200 }}
            >
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body row p-5">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                      <img
                        src={img}
                        width={200}
                        className="rounded-circle"
                        alt={registration}
                      />
                    </div>
                    <Form
                      noValidate
                      onSubmit={handleSubmit}
                      className="col-12 col-md-6 mt-3 mt-mb-0"
                    >
                      <h1 className="text-center mb-4">{registration}</h1>
                      <Form.Group className="mb-3 position-relative">
                        <div className="form-floating mb-3">
                          <Form.Control
                            type="text"
                            name="username"
                            placeholder={username}
                            id="username"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.username}
                            isInvalid={touched.username && errors.username}
                            autoFocus
                          />
                          <Form.Label htmlFor="username">{username}</Form.Label>
                          <ErrorMessage name="username">
                            {(msg) => (
                              <div className=" invalid-tooltip">{msg}</div>
                            )}
                          </ErrorMessage>
                        </div>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <div className="form-floating mb-3">
                          <Form.Control
                            name="password"
                            type="password"
                            autoComplete="password"
                            required
                            onBlur={handleBlur}
                            placeholder={password}
                            id="password"
                            onChange={handleChange}
                            value={values.password}
                            isInvalid={touched.password && errors.password}
                          />
                          <Form.Label htmlFor="password">{password}</Form.Label>
                          <ErrorMessage name="password">
                            {(msg) => (
                              <div className=" invalid-tooltip">{msg}</div>
                            )}
                          </ErrorMessage>
                        </div>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <div className="form-floating mb-3">
                          <Form.Control
                            name="repeatPassword"
                            type="password"
                            autoComplete="repeatPassword"
                            required
                            placeholder={repeatPassword}
                            id="repeat-password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.repeatPassword}
                            isInvalid={
                              touched.repeatPassword && errors.repeatPassword
                            }
                            ref={inpRepeat}
                          />
                          <Form.Label htmlFor="repeat-password">
                            {repeatPassword}
                          </Form.Label>
                          <Form.Control.Feedback type="invalid" tooltip>
                            {errors.repeatPassword}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>
                      <Button
                        type="submit"
                        className="w-100 mb-3 btn btn-outline-primary"
                        variant="outline-primary"
                        disabled={isSubmitting}
                      >
                        {toRegister}
                      </Button>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default RegistrationPage;
