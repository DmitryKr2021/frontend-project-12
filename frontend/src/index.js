import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./slices/index.js";
import i18next from "i18next";
import { io } from "socket.io-client";
import { initReactI18next } from "react-i18next";
import ru from "./locales/ru.js";
import { addNewMessage } from "./slices/messages";
import { addNewChannel, setActiveChannel } from "./slices/channels";

export const userContext = createContext();

export const i18n = i18next
.use(initReactI18next) // передаем экземпляр i18n в react-i18next, который сделает его доступным для всех компонентов через context API.
.init({
  resources: { ru },
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false, // экранирование уже есть в React, поэтому отключаем
  },
});

const runApp = async () => {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  const socket = new io();
  await socket.on("newMessage", (payload) => {
    store.dispatch(addNewMessage(payload));
  });
  await socket.on("newChannel", (payload) => {
    const { channelNumber } = payload;
    store.dispatch(addNewChannel(payload));
    store.dispatch(setActiveChannel(channelNumber));
  });

  root.render(
    <userContext.Provider value={{ socket: { socket } }}>
      <Provider store={store}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </Provider>
    </userContext.Provider>
  );
};
runApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
