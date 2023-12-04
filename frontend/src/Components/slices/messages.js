import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessages: (state, action) => {
      const { payload } = action;
      const { messages } = payload;
      messages.map((item, ind) => {
        state.messages[ind] = item;
      })
    },
  },
});

export const { addMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
