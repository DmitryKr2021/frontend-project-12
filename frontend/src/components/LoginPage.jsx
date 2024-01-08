import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, ErrorMessage } from 'formik';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/index.jsx';
import img from '../imgs/autorization.jpg';
import { addUser, setActiveUser } from '../slices/users';

const LoginPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const serverError = t('errors.serverError');
  const enter = t('login.enter');
  const nik = t('login.nik');
  const password = t('login.password');
  const noAccount = t('login.noAccount');
  const registration = t('login.registration');
  const auth = useAuth();
  const navigate = useNavigate();
  const inpName = useRef();

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={(values, { setErrors }) => {
        axios
          .post('/api/v1/login', {
            username: values.username,
            password: values.password,
          })
          .then((response) => {
            dispatch(addUser(response.data));
            dispatch(setActiveUser(response.data));
            auth.logIn();
            navigate('/main');
          })
          .catch((error) => {
            if (error.response) {
              inpName.current.select();
              setErrors({
                username: serverError,
                password: serverError,
              });
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log('Error', error.message);
            }
          });
      }}
    >
      {({
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        touched,
        errors,
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
                        className="rounded-circle"
                        alt="Войти/Enter"
                      />
                    </div>
                    <Form
                      onSubmit={handleSubmit}
                      className="col-12 col-md-6 mt-3 mt-mb-0"
                    >
                      <h1 className="text-center mb-4">{enter}</h1>
                      <Form.Group className="mb-3">
                        <div className="form-floating mb-3">
                          <Form.Control
                            name="username"
                            autoComplete="username"
                            required
                            placeholder={nik}
                            id="username"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.username}
                            isInvalid={touched.username && errors.username}
                            autoFocus
                            ref={inpName}
                          />
                          <Form.Label htmlFor="username">{nik}</Form.Label>
                        </div>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <div className="form-floating mb-3">
                          <Form.Control
                            name="password"
                            type="password"
                            autoComplete="password"
                            placeholder={password}
                            required
                            id="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            isInvalid={touched.password && errors.password}
                          />
                          <Form.Label htmlFor="password">{password}</Form.Label>
                          <ErrorMessage name="password">
                            {(msg) => (
                              <div className="invalid-tooltip">{msg}</div>
                            )}
                          </ErrorMessage>
                        </div>
                      </Form.Group>

                      <Button
                        type="submit"
                        className="w-100 mb-3 btn btn-outline-primary"
                        variant="outline-primary"
                      >
                        {enter}
                      </Button>
                    </Form>
                  </div>
                  <div className="card-footer p-4">
                    <div className="text-center">
                      <span>{noAccount}</span>
                      <Link to="/signup">{registration}</Link>
                    </div>
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

export default LoginPage;
