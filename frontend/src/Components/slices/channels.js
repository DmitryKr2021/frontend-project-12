import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    addChannels: (state, action) => {
      state.value.includes(action.payload) ? null : state.value.push(action.payload);
    },
  },
});

export const { addChannels } = channelsSlice.actions;
export default channelsSlice.reducer;