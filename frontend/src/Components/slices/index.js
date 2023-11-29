import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channels.js';
//import chatReducer from './chat.js';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    //chat: chatReducer,
  },
});
