import { configureStore } from '@reduxjs/toolkit';
import channelsSliceReducer from './channels';
import messagesSliceReducer from './messages';
import usersSliceReducer from './users';

export default configureStore({
  reducer: {
    channelsSlice: channelsSliceReducer,
    messagesSlice: messagesSliceReducer,
    usersSlice: usersSliceReducer,
  },
});
