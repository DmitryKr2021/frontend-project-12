import React, { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
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

const getAuthHeader = () => {
  //return {};
};

getAuthHeader();

/*const AuthProvider = ({ children }) => {
  const logIn = () => setLog({loggedIn: true, logIn, logOut});
  const logOut = () => {
    setLog({loggedIn: false, logIn, logOut});
    localStorage.removeItem("user");
  };
  const [log, setLog] = useState({loggedIn: false, logIn, logOut});

  return (
    <AuthContext.Provider value={log}>
      {children}
    </AuthContext.Provider>
  );
};*/
const AuthProvider = ({ children }) => {
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    setLoggedIn(false);
    localStorage.removeItem("user");
  };
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{loggedIn, logIn, logOut}}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const ChatPage = ({children}) => {
  const auth = useAuth();
  const location = useLocation();
    return auth.loggedIn ? (
    children
    ) : (
      <Navigate to="/login"  state={{ from: location }} replace={true}/>
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

const AuthButton = () => {
  const auth = useAuth();
  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>Выйти</Button>
      : null
  );
};

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
          <AuthButton />
        </div>
      </nav>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
