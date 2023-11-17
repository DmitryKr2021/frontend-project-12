import React from "react";
import { MainPage } from "./MainPage";

const pageLoader = () => {
  return (<h3>Loading...</h3>)
};

export { MainPage, pageLoader };
export { default as LoginPage } from "./login-page";
export { default as ErrorPage } from "./error-page";
export { default as RegistrationPage } from "./registration-page";
