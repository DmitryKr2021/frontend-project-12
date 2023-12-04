import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeChannel: 0,
};

const activeChannelSlice = createSlice({
  name: "active",
  initialState,
  reducers: {
    setActiveChannel: (state, action) => {
      const { payload } = action;
      state.activeChannel = payload;
    },
  },
});

export const { setActiveChannel } = activeChannelSlice.actions;
export default activeChannelSlice.reducer;
