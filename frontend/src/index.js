import React from "react";
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

export const socket = new io();

export const socketEmitMessage = (newMessage, setShowAlert) => socket.emit("newMessage", newMessage, (response) => {
  const { status } = response;
  const { body } = newMessage;
  setShowAlert(status === "ok" ? false : true);
  console.log(
    status === "ok"
      ? `Сообщение ${body} доставлено`
      : `Сообщение ${body} не доставлено`
  );  
  /*if (status === 'ok') {
    socket.on('newMessage', (payload) => {
      console.log('payload=', payload);
      //dispatch(addNewMessage(payload));
    });
  }*/
});

export const socketOnMessage = (dispatch) => socket.on('newMessage', (payload) => {
  dispatch(addNewMessage(payload));
});

export const i18n = i18next
  .use(initReactI18next) // передаем экземпляр i18n в react-i18next, который сделает его доступным для всех компонентов через context API.
  .init({
    resources: { ru },
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false, // экранирование уже есть в React, поэтому отключаем
    },
  });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
