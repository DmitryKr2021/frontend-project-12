import { configureStore } from '@reduxjs/toolkit';
import channelsSliceReducer from './channels';
import messagesSliceReducer from './messages';

export default configureStore({
  reducer: {
    channelsSlice: channelsSliceReducer,
    messagesSlice: messagesSliceReducer,
  },
});
