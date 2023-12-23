import React, { useEffect, useRef } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Form } from "react-bootstrap";
import img from "../imgs/autorization.jpg";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/index.jsx";
import cn from "classnames";

const Schema = Yup.object().shape({
  username: Yup.string()
    .min(3, "От 3 до 20 символов")
    .max(20, "От 3 до 20 символов")
    .required("Обязательное поле"),
  password: Yup.string()
    .min(5, "От 5 до 20 символов")
    .max(20, "От 5 до 20 символов")
    .required("Обязательное поле"),
});

const LoginPage = () => {
  const msgClass = cn("invalid-tooltip");
  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (window.localStorage.length > 0) {
      auth.logIn();
      navigate("/main");
    }
  }, [auth, navigate, auth.loggedIn]);

  const inpName = useRef();

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={Schema}
      onSubmit={(values, { setErrors }) => {
        axios
          .post("/api/v1/login", {
            username: values.username,
            password: values.password,
          })
          .then((response) => {
            window.localStorage.setItem("user", JSON.stringify(response.data));
            auth.logIn();
            navigate("/main");
          })
          .catch((error) => {
            if (error.response) {
             inpName.current.select();
              setErrors({
                username: "Неверные имя пользователя или пароль",
                password: "Неверные имя пользователя или пароль",
              });
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log("Error", error.message);
            }
            // throw error;
          });
      }}
    >
      {({
        //isSubmitting,
        handleSubmit,
        getFieldProps,
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
                            {...getFieldProps("username")}
                            isInvalid={touched.username && errors.username}
                            autoFocus
                            ref={inpName}
                          />
                          <Form.Label htmlFor="username">Ваш ник</Form.Label>
                          <ErrorMessage name="username">
                            {(msg) => (
                              <div
                                className={            
                                  errors.username === "Неверные имя пользователя или пароль"
                                    ? msgClass + " visually-hidden"
                                    : msgClass
                                }
                              >
                                {msg}
                              </div>
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
                            placeholder="Пароль"
                            required
                            id="password"
                            {...getFieldProps("password")}
                            isInvalid={touched.password && errors.password}
                          />
                          <Form.Label htmlFor="password">Пароль</Form.Label>
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
                        //disabled={isSubmitting}
                      >
                        Войти
                      </Button>
                    </Form>
                  </div>
                  <div className="card-footer p-4">
                    <div className="text-center">
                      <span>Нет аккаунта? </span>
                      <Link to="/registration">Регистрация</Link>
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
