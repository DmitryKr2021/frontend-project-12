import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channels: [],
  messages: [],
};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    addChannels: (state, action) => {
      state.channels.includes(action.payload)
        ? state.channels
        : state.channels.push(action.payload);
    },
    addMessages: (state, action) => {
      state.messages.includes(action.payload)
        ? state.messages
        : state.messages.push(action.payload);
    },
  },
});

export const { addChannels, addMessages } = channelsSlice.actions;
export default channelsSlice.reducer;

