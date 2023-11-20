//import React, { useState, useEffect } from "react";
import React from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Form } from "react-bootstrap";
import img from "../imgs/registration.png";

const Schema = Yup.object().shape({
  username: Yup.string()
    .min(5, "От 5 до 15 символов")
    .max(15, "От 5 до 15 символов")
    .required("Обязательное поле"),
  password: Yup.string()
    .min(5, "От 5 до 15 символов")
    .max(15, "От 5 до 15 символов")
    .required("Обязательное поле"),
  repeatPassword: Yup.string()
    .required("Обязательное поле")
    .oneOf([Yup.ref("password"), null], "Пароль должен совпадать"),
});

const RegistrationPage = () => {
  return (
    <Formik
      initialValues={{ username: "", password: "", repeatPassword: "" }}
      validationSchema={Schema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({
        values,
        handleChange,
        isSubmitting,
        handleSubmit,
        errors,
        handleBlur,
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
                        alt="Регистрация"
                      />
                    </div>
                    <Form
                      noValidate
                      onSubmit={handleSubmit}
                      className="col-12 col-md-6 mt-3 mt-mb-0"
                    >
                      <h1 className="text-center mb-4">Регистрация</h1>
                      <Form.Group className="mb-3 position-relative">
                        <div className="form-floating mb-3">
                          <Form.Control
                            type="text"
                            name="username"
                            placeholder="От 5 до 15 символов"
                            id="username"
                            onChange={handleChange}
                            value={values.username}
                            onBlur={handleBlur}
                            isInvalid={touched.username && errors.username}
                            autoFocus
                          />
                          <Form.Label htmlFor="username">
                            Имя пользователя
                          </Form.Label>
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
                            placeholder="Пароль"
                            id="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            isInvalid={touched.password && errors.password}
                          />
                          <Form.Label htmlFor="password">Пароль</Form.Label>
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
                            placeholder="Подтвердите пароль"
                            id="repeat-password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.repeatPassword}
                            isInvalid={touched.repeatPassword && errors.repeatPassword}
                          />
                          <Form.Label htmlFor="repeat-password">
                            Подтвердите пароль
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
                        Зарегистрироваться
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
