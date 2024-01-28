import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import i18next from 'i18next';
import { io as Io } from 'socket.io-client';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import store from './slices/index';
import App from './App';
import ru from './locales/ru';
import { addNewMessage } from './slices/messages';
import {
  addNewChannel,
  removeChannel,
  renameChannel,
  setActiveChannel,
} from './slices/channels';
import { ApiContext } from './components/contexts/index.jsx';

const runApp = async () => {
  const { dispatch } = store;
  const socket = new Io();

  const emitMessage = async (nameEmit, bodyEmit) => {
    const response = await socket.timeout(2000).emitWithAck(nameEmit, bodyEmit);
    return response;
  };

  const emitChannel = async (nameEmit, bodyEmit) => {
    const response = await socket
      .timeout(2000)
      .emitWithAck(nameEmit, bodyEmit);
    if (nameEmit === 'newChannel') {
      const { data } = response;
      dispatch(setActiveChannel(data.id));
    }
    return response;
  };

  const i18n = i18next.createInstance();
  await i18n.use(initReactI18next).init({
    resources: { ru },
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });
  const root = ReactDOM.createRoot(document.getElementById('root'));

  socket.on('newMessage', (payload) => {
    dispatch(addNewMessage(payload));
  });
  socket.on('newChannel', (payload) => {
    dispatch(addNewChannel(payload));
  });
  socket.on('removeChannel', (payload) => {
    const { id } = payload;
    dispatch(removeChannel(id));
  });
  socket.on('renameChannel', (payload) => {
    dispatch(renameChannel(payload));
  });
  // eslint-disable-next-line
 
  root.render(
    <ApiContext.Provider value={{ socket: { socket }, emitMessage, emitChannel }}>
      <Provider store={store}>
        <React.StrictMode>
          <I18nextProvider i18n={i18n} defaultNS="translation">
            <App />
          </I18nextProvider>
        </React.StrictMode>
      </Provider>
    </ApiContext.Provider>,
  );
};
runApp();
