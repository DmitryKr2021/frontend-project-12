import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { PageOne, PageTwo } from "./Components/Pages";
import { MainPage } from "./Components/MainPage";
import ErrorPage from "./Components/error-page";
import "./App.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainPage />}>
      <Route index element={<div>No page is selected.</div>} />
      <Route path="one" element={<PageOne />} />
      <Route path="two" element={<PageTwo />} />
      <Route path="*" element={<ErrorPage />} />
    </Route>
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
