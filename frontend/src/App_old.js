import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PageOne, PageTwo } from "./Components/Pages";
import { MainPage } from "./Components/MainPage";
import ErrorPage from "./Components/error-page";
import "./App.css";

function App() {
 return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />}>
          <Route index element={<div>No page is selected.</div>} />
          <Route path="one" element={<PageOne />} />
          <Route path="two" element={<PageTwo />} />
          <Route path="*" element={<ErrorPage />} errorElement={<ErrorPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
