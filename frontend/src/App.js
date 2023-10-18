import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { MainPage } from "./Components/MainPage";
import ErrorPage from "./Components/error-page";
import SignupForm from "./Components/login-page";
import "./App.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainPage />}>
      <Route index element={<div>No page is selected.</div>} />
      <Route path="login" element={<SignupForm />} />
      <Route path="*" element={<ErrorPage />} />
    </Route>
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
