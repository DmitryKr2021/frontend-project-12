import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    addChats: (state, action) => {
      state.value.includes(action.payload) ? null : state.value.push(action.payload);
    },
  },
});

export const { addChats } = chatSlice.actions;
export default chatSlice.reducer;