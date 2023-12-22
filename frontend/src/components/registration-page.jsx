import React from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Form } from "react-bootstrap";
import img from "../imgs/registration.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/index.jsx";

const Schema = Yup.object().shape({
  username: Yup.string()
    .min(3, "От 3 до 20 символов")
    .max(20, "От 3 до 20 символов")
    .required("Обязательное поле"),
  password: Yup.string()
    .min(6, "От 6 до 20 символов")
    .max(20, "От 6 до 20 символов")
    .required("Обязательное поле"),
  repeatPassword: Yup.string()
    .required("Обязательное поле")
    .oneOf([Yup.ref("password"), null], "Пароль должен совпадать"),
});

const RegistrationPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  console.log("localStor=", window.localStorage);
  console.log("auth=", auth);
  return (
    <Formik
      initialValues={{ username: "", password: "", repeatPassword: "" }}
      validationSchema={Schema}
      onSubmit={(values) => {
        console.log(values);
        axios
          .post("/api/v1/signup", {
            username: values.username,
            password: values.password,
          })
          .then((response) => {
            console.log(response.data);
            auth.logIn();
            navigate("/main");
          })
          .catch((error) => {
            if (error.response) {
              navigate("/conflict");
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
              return;
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log("Error", error.message);
            }
            throw error;
          });
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
                            isInvalid={
                              touched.repeatPassword && errors.repeatPassword
                            }
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
