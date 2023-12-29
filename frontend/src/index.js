import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./slices/index.js";
import i18next from "i18next";
import { io } from "socket.io-client";
import { initReactI18next, I18nextProvider } from "react-i18next";
import App from "./App";
import ru from "./locales/ru.js";
import { addNewMessage, removeMessages } from "./slices/messages";
import {
  addNewChannel,
  setActiveChannel,
  removeChannel,
  renameChannel,
} from "./slices/channels";

export const userContext = createContext();
const { dispatch } = store;

const runApp = async () => {
  const i18n = i18next.createInstance();
  await i18n.use(initReactI18next).init({
    resources: { ru },
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false,
    },
  });

  const root = ReactDOM.createRoot(document.getElementById("root"));
  const socket = new io();
  await socket.on("newMessage", (payload) => {
    dispatch(addNewMessage(payload));
  });
  await socket.on("newChannel", (payload) => {
    const { id } = payload;
    dispatch(addNewChannel(payload));
    dispatch(setActiveChannel(id));
  });
  await socket.on("removeChannel", (payload) => {
    const { id } = payload;
    dispatch(removeChannel(id));
    dispatch(setActiveChannel(1));
    dispatch(removeMessages(id));
  });
  await socket.on("renameChannel", (payload) => {
    dispatch(renameChannel(payload));
  });

  root.render(
    <userContext.Provider value={{ socket: { socket } }}>
      <Provider store={store}>
        <React.StrictMode>
          <I18nextProvider i18n={i18n} defaultNS={"translation"}>
            <App />
          </I18nextProvider>
        </React.StrictMode>
      </Provider>
    </userContext.Provider>
  );
};
runApp();
