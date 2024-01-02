import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
  useLocation,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Provider, ErrorBoundary } from "@rollbar/react";
import {
  pageLoader,
  ErrorPage,
  LoginPage,
  RegistrationPage,
  ConflictPage,
} from './components/Pages';
import MainPage from './components/MainPage.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import AuthContext from './components/contexts/index.jsx';
import useAuth from './hooks/index.jsx';

const rollbarConfig = {
  // eslint-disable-next-line no-undef
  accessToken: process.env.REACT_APP_SECRET_CODE,
  environment: "production",
};

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    setLoggedIn(false);
    localStorage.removeItem('user');
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
  return auth.loggedIn ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
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
      <Route path="signup" element={<RegistrationPage />} />
      <Route
        path="main"
        element={
          <ChatPage>
            <MainPage />
          </ChatPage>
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Route>,
  ),
);

const OutButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  const goOut = t('app.goOut');
  return auth.loggedIn ? <Button onClick={auth.logOut}>{goOut}</Button> : null;
};

const App = () => {
  useEffect(() => {
    const body = document.querySelector('body');
    body.className = 'bg-light h-100';
  });

  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <AuthProvider>
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
      </ErrorBoundary>
    </Provider>
  );
};

export default App;

