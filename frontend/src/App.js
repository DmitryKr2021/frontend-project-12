import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
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
  RegistrationPage,
  ConflictPage,
} from "./components/Pages";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import AuthContext from "./components/contexts/index.jsx";
import useAuth from "./hooks/index.jsx";
import PropTypes from "prop-types";

/*const getAuthHeader = () => {
  //return {};
};
getAuthHeader();*/

const AuthProvider = ({ children }) => {
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    setLoggedIn(false);
    localStorage.removeItem("user");
  };
  const [loggedIn, setLoggedIn] = useState(false);
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
  return auth.loggedIn ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace={true} />
  );
};

ChatPage.propTypes = {
  children: PropTypes.node.isRequired,
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={null}>
      <Route
        index
        loader={pageLoader}
        element={
          <ChatPage>
            <MainPage />
          </ChatPage>
        }
      />
      <Route path="login" element={<LoginPage />} />
      <Route path="conflict" element={<ConflictPage />} />
      <Route path="registration" element={<RegistrationPage />} />
      <Route
        path="main"
        element={
          <ChatPage >
            <MainPage />
          </ChatPage>
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);

const OutButton = () => {
  const auth = useAuth();
  return auth.loggedIn ? <Button onClick={auth.logOut}>Выйти</Button> : null;
};

const App = () => {
  useEffect(() => {
    const body = document.querySelector("body");
    body.className = "bg-light h-100";
  });

  return (
    <AuthProvider >
      <div className="h-100">
        <div className="h-100" id="chat">
          <div className="h-100 d-flex flex-column">
            <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
              <div className="container">
                <a className="navbar-brand" href="/">
                  Hexlet Chat
                </a>
                <OutButton />
              </div>
            </nav>
            <RouterProvider router={router} />
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
