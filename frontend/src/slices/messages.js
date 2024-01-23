/* eslint-disable no-param-reassign */

import { createSlice, current } from '@reduxjs/toolkit';
import { removeChannel } from './channels';

const initialState = {
  messages: [],
};

const scrollToLast = (b) => {
  const last = document.querySelector(".last");
  last.scrollIntoView({
    behavior: b || 'auto',
    block: 'end',
  });
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    loadMessages: (state, { payload }) => {
      const { messages } = payload;
      state.messages = messages;
      scrollToLast('smooth');
    },
    addNewMessage: (state, { payload }) => {
      state.messages = [...state.messages, payload];
      scrollToLast('smooth');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, { payload }) => {
      const restMessages = current(state).messages
        .filter((message) => message.channelId !== payload);
      state.messages = restMessages;
    });
  },
});

export const { loadMessages, addNewMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
