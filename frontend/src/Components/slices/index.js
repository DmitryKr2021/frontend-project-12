import { configureStore } from '@reduxjs/toolkit';
import channelsSliceReducer from './channels.js';
//import chatReducer from './chat.js';

export default configureStore({
  reducer: {
    channels: channelsSliceReducer,
    //chat: chatReducer,
  },
});
