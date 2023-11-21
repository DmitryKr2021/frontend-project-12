import React from "react";
import { Formik } from "formik";
import { Button, Form } from "react-bootstrap";
import img from "../imgs/autorization.jpg";
import axios from 'axios';


//const addr = "http://localhost:5001/api/v1/login";

axios.post('/api/v1/login', { username: 'admin', password: 'admin' }).then((response) => {
//axios.post(addr, { username: 'admin', password: 'admin' }).then((response) => {
  console.log(response.data); // => { token: ..., username: 'admin' }
});

const LoginPage = () => {
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
        setTimeout(() => {
          //alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ values, handleChange, isSubmitting, handleSubmit }) => (
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
                            className="form-control"
                            onChange={handleChange}
                            value={values.username}
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
                            className="form-control"
                            onChange={handleChange}
                            value={values.password}
                          />
                          <Form.Label htmlFor="password">Пароль</Form.Label>
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
