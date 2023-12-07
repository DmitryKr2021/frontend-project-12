import i18next from "i18next";
import { io } from "socket.io-client";
import ru from "./locales/ru.js";
import { initReactI18next } from "react-i18next";

/*export default async () => {
    const i18n = i18next.createInstance();
     await i18n.init({
      lng: 'ru',
      debug: false,
      resources: { ru, }
    });*/

export const socket = new io();
/*socket.on("newMessage", (payload) => {
  console.log("newMessage=", payload);
});*/

i18next
  .use(initReactI18next) // передаем экземпляр i18n в react-i18next, который сделает его доступным для всех компонентов через context API.
  .init({
    resources: { ru },
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false, // экранирование уже есть в React, поэтому отключаем
    },
  });

export default i18next;
