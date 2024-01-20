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
import { Provider, ErrorBoundary } from '@rollbar/react';
import {
  pageLoader,
  ErrorPage,
  LoginPage,
  RegistrationPage,
  ConflictPage,
} from './components/Pages.jsx';
import MainPage from './components/MainPage.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import AuthContext from './components/contexts/index.jsx';
import useAuth from './hooks/index.jsx';
import * as routes from './routes';

const rollbarConfig = {
  // eslint-disable-next-line no-undef
  accessToken: process.env.REACT_APP_SECRET_CODE,
  environment: 'production',
};

const AuthProvider = ({ children }) => {
  const auth = useAuth();
  const [activeUser, setActiveUser] = useState(localStorage.key(0) || null);
  const setUser = (data) => {
    const { username } = data;
    setActiveUser(username);
    window.localStorage.setItem(username, JSON.stringify(data));
  };
  const logOut = () => {
    setActiveUser(null);
    localStorage.removeItem(activeUser);
  };

  const { token } = localStorage.length > 0 && JSON.parse(localStorage.getItem(activeUser));

  /* eslint-disable max-len */
  return (
    <AuthContext.Provider value={{ logOut, activeUser, token, setUser, socket: auth.socket }}>
      {children}
    </AuthContext.Provider>
  );
};
/* eslint-enable */
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const ChatPage = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  return auth.activeUser ? (
    children
  ) : (
    <Navigate to={routes.loginPath()} state={{ from: location }} replace />
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
        element={(
          <ChatPage>
            <MainPage />
          </ChatPage>
        )}
      />
      <Route path={routes.loginPath()} element={<LoginPage />} />
      <Route path={routes.conflictPath()} element={<ConflictPage />} />
      <Route path={routes.signupPath()} element={<RegistrationPage />} />
      <Route
        path={routes.mainPath()}
        element={(
          <ChatPage>
            <MainPage />
          </ChatPage>
        )}
      />
      <Route path="*" element={<ErrorPage />} />
    </Route>,
  ),
);

const OutButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  const goOut = t('app.goOut');
  return auth.activeUser ? <Button onClick={auth.logOut}>{goOut}</Button> : null;
};

document.querySelector('body').className = 'bg-light h-100';

const App = () => {
  useEffect(() => {
    localStorage.clear();
  }, []);
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
