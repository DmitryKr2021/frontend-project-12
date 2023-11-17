import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  MainPage,
  pageLoader,
  ErrorPage,
  LoginPage,
  RegistrationPage
} from "./Components/Pages";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import AuthContext from "./Components/contexts/index.jsx";
import useAuth from "./Components/hooks/index.jsx";
import PropTypes from "prop-types";

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem("userId");
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const ChatPage = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  console.log(auth.login);
  return auth.loggedIn ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

ChatPage.propTypes = {
  children: PropTypes.node.isRequired,
};

/*const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainPage />}>
      <Route index loader={pageLoader} element={<div>It&apos;s a MAIN page </div>} />
      <Route path="login" element={<LoginPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Route>
  ),
);*/

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={null}>
      <Route
        index
        loader={pageLoader}
        //element={<MainPage/>}
        element={
          <ChatPage>
            <MainPage />
          </ChatPage>
        }
      />
      <Route path="login" element={<LoginPage />} />
      <Route path="registration" element={<RegistrationPage />} />
      <Route
        path="main"
        element={
          <ChatPage>
            <MainPage />
          </ChatPage>
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);

function App() {
  useEffect(() => {
    const body = document.querySelector("body");
    body.className = "bg-light";
  });
  return (
    <AuthProvider>
      <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <a className="navbar-brand" href="/">
            Hexlet Chat
          </a>
          <button type="button" className="btn btn-primary">
            Выйти
          </button>
        </div>
      </nav>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
