// eslint-disable
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    renderMessages: (state, action) => {
      const { payload } = action;
      const { messages } = payload;
      state.messages = [...messages];
    },
    addNewMessage: (state, action) => {
      const { payload } = action;
      state.messages = [...state.messages, payload];
    },
    removeMessages: (state, action) => {
      const { payload } = action;
      const newMessages = state.messages.filter((message) => message.channelId !== payload);
      state.messages.push([...newMessages]);
    },
  },
});

export const { renderMessages, addNewMessage, removeMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
