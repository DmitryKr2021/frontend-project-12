import React, { useRef } from 'react';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/index.jsx';
import img from '../imgs/registration.png';
import * as routes from '../routes';

const RegistrationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const inpRepeat = useRef();

  const Schema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('errors.loginLength'))
      .max(20, t('errors.loginLength'))
      .required(t('errors.required')),
    password: Yup.string()
      .min(6, t('errors.passwordLength'))
      .max(20, t('errors.passwordLength'))
      .required(t('errors.required')),
    repeatPassword: Yup.string()
      .required(t('errors.required'))
      .oneOf([Yup.ref('password'), null], t('errors.coincidePass')),
  });

  return (
    <Formik
      initialValues={{ username: '', password: '', repeatPassword: '' }}
      validationSchema={Schema}
      onSubmit={async (values) => {
        try {
          const response = await axios
            .post(routes.apiSignupPath(), {
              username: values.username,
              password: values.password,
            });
          const { data } = response;
          auth.setUser(data);
          navigate(routes.mainPath());
        } catch (error) {
          if (error.response) {
            navigate(routes.conflictPath());
            console.error(error.response.status);
          }
        }
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
                        alt={t('registration.registration')}
                      />
                    </div>
                    <Form
                      noValidate
                      onSubmit={handleSubmit}
                      className="col-12 col-md-6 mt-3 mt-mb-0"
                    >
                      <h1 className="text-center mb-4">{t('registration.registration')}</h1>
                      <Form.Group className="mb-3 position-relative">
                        <div className="form-floating mb-3">
                          <Form.Control
                            type="text"
                            name="username"
                            placeholder={t('registration.username')}
                            id="username"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.username}
                            isInvalid={touched.username && errors.username}
                            autoFocus
                          />
                          <Form.Label htmlFor="username">{t('registration.username')}</Form.Label>
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
                            placeholder={t('registration.password')}
                            id="password"
                            onChange={handleChange}
                            value={values.password}
                            isInvalid={touched.password && errors.password}
                          />
                          <Form.Label htmlFor="password">{t('registration.password')}</Form.Label>
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
                            placeholder={t('registration.repeatPassword')}
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
                            {t('registration.repeatPassword')}
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
                        {t('registration.toRegister')}
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
