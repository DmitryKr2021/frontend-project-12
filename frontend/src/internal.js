//import { createContext } from 'react';
//const userContext = createContext();
export { default as MainPage } from './components/MainPage.jsx';
export {
  pageLoader,
  ErrorPage,
  LoginPage,
  RegistrationPage,
  ConflictPage,
} from './components/Pages';
export {
    addNewChannel,
    setActiveChannel,
    removeChannel,
    renameChannel,
    renderChannels,
  } from './slices/channels';
export { default as ru } from './locales/ru.js';
export { default as AuthContext } from './components/contexts/index.jsx';
export { default as useAuth } from './hooks/index.jsx';
export { default as SvgSend } from './components/svg/SvgSend.jsx';
//export { renderChannels } from './slices/channels.js';
export { renderMessages, addNewMessage, removeMessages } from './slices/messages.js';
export { default as imgReg } from './imgs/registration.png';
export { default as imgLog } from './imgs/autorization.jpg';
export { default as Channels } from './components/Channels.jsx';
export { default as Messages } from './components/Messages.jsx';


/*export { default as AddChannel } from './components/modals/AddChannel.jsx';
export { default as Remove } from './components/modals/RemoveChannel.jsx';
export { default as Rename } from './components/modals/RenameChannel.jsx';*/
