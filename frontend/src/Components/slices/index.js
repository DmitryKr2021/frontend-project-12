import { configureStore } from '@reduxjs/toolkit';
import channelsSliceReducer from './channels.js';
import messagesSliceReducer from './messages.js';
import activeChannelSliceReducer from './active.js';

export default configureStore({
  reducer: {
    channelsSlice: channelsSliceReducer,
    messagesSlice: messagesSliceReducer,
    activeChannelSlice: activeChannelSliceReducer,
  },
});
