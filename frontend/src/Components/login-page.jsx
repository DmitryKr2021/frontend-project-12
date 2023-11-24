import React from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Form } from "react-bootstrap";
import img from "../imgs/autorization.jpg";
import axios from "axios";
import useAuth from './hooks/index.jsx';

const Schema = Yup.object().shape({
  username: Yup.string()
    .oneOf(['admin', null], "Неверные имя пользователя или пароль"),
  password: Yup.string()
    .oneOf(['admin', null], "Неверные имя пользователя или пароль"),
});

const LoginPage = () => {
  const auth = useAuth();
  console.log('(1) auth=', auth);
  if (window.localStorage.length > 0) {
   // const user = window.localStorage.getItem("user");
   // console.log("user token===", JSON.parse(user).token);
  }
  /*if (JSON.parse(user).token) {
    //auth.logIn();
  }*/
  
  //window.localStorage.clear();

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={Schema}
      onSubmit={(values) => {
        axios.post('/api/v1/login', { username: values.username, password: values.password }).then((response) => {
          window.localStorage.setItem('user', JSON.stringify(response.data));
          auth.logIn();
          console.log('(2) auth.loggedIn=', auth, auth.loggedIn);
        })
        .catch ((error) => {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log('Error', error.message);
          }
          throw(error);
        })
      }}
    >
      {({ values, handleChange, isSubmitting, handleSubmit, touched, errors }) => (
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
                      <img src={img} className="rounded-circle" alt="Войти" />
                    </div>
                    <Form
                      onSubmit={handleSubmit}
                      className="col-12 col-md-6 mt-3 mt-mb-0"
                    >
                      <h1 className="text-center mb-4">Войти</h1>
                      <Form.Group className="mb-3">
                        <div className="form-floating mb-3">
                          <Form.Control
                            name="username"
                            autoComplete="username"
                            required
                            placeholder="Ваш ник"
                            id="username"
                            onChange={handleChange}
                            value={values.username}
                            isInvalid={touched.username && errors.username}
                            autoFocus
                          />
                          <Form.Label htmlFor="username">Ваш ник</Form.Label>
                        </div>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <div className="form-floating mb-3">
                          <Form.Control
                            name="password"
                            type="password"
                            autoComplete="password"
                            placeholder="Пароль"
                            required
                            id="password"
                            onChange={handleChange}
                            value={values.password}
                            isInvalid={touched.password && errors.password}
                          />
                          <Form.Label htmlFor="password">Пароль</Form.Label>
                          <ErrorMessage name="username">
                            {(msg) => (
                              <div className=" invalid-tooltip">{msg}</div>
                            )}
                          </ErrorMessage>
                        </div>
                      </Form.Group>
                      <Button
                        type="submit"
                        className="w-100 mb-3 btn btn-outline-primary"
                        variant="outline-primary"
                        disabled={isSubmitting}
                      >
                        Войти
                      </Button>
                    </Form>
                  </div>
                  <div className="card-footer p-4">
                    <div className="text-center">
                      <span>Нет аккаунта? </span>
                      <a href="/registration">Регистрация</a>
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
