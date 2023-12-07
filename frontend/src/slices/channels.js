import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channels: {
    name: [],
    id: [],
  },
  activeChannel: 1,
};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    renderChannels: (state, action) => {
      const { payload } = action;
      const { channels } = payload;
      channels.map((item, ind) => {
        state.channels.name[ind] = item.name;
        state.channels.id[ind] = item.id;
      })
    },
    setActiveChannel: (state, action) => {
      const { payload } = action;
      state.activeChannel = payload;
    },
  },
});

export const { renderChannels, setActiveChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
