import { createSlice } from "@reduxjs/toolkit";
//import { socket } from "../init.js";

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    renderMessages: (state, action) => {
      const { payload } = action;
      const { messages } = payload;
      messages.map((item, ind) => {
        state.messages[ind] = item;
      })
    },
    addNewMessage: (state, action) => {
      const { payload } = action;
      state.messages.push(payload);
    }
   /* addNewMessage: () => {
      socket.on('newMessage', (payload) => {
        console.log('payload===', payload);
        state.messages.push(payload);
      })
    }*/
  },
});

export const { renderMessages, addNewMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
