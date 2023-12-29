import React from "react";
import { MainPage } from "./MainPage";

const pageLoader = () => {
  return (<h3>Loading...</h3>)
};

export { MainPage, pageLoader };
export { default as LoginPage } from "./LoginPage";
export { default as ErrorPage } from "./ErrorPage";
export { default as ConflictPage } from "./ConflictPage";
export { default as RegistrationPage } from "./RegistrationPage";
