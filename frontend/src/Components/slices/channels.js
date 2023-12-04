import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channels: {
    name: [],
    id: [],
  },
};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    addChannels: (state, action) => {
      const { payload } = action;
      const { channels } = payload;
      channels.map((item, ind) => {
        state.channels.name[ind] = item.name;
        state.channels.id[ind] = item.id;
      })
    },
  },
});

export const { addChannels } = channelsSlice.actions;
export default channelsSlice.reducer;
