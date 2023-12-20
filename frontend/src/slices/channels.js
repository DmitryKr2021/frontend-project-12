import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channels: [{id: '', name: '', removable: ''}],
  activeChannel: 1,
};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    renderChannels: (state, action) => {
      const { channels } = action.payload;
      state.channels = channels;
    },
    setActiveChannel: (state, action) => {
      const { payload } = action;
      state.activeChannel = payload;
    },
    addNewChannel: (state, action) => {
      const { payload } = action;
      state.channels = [...state.channels, payload];
    },
    removeChannel: (state, action) => {
      const { payload } = action;
      const newChannels = state.channels.filter((item) => item.id !== payload)
      state.channels = [...newChannels];
    },
  },
});

export const { renderChannels, setActiveChannel, addNewChannel, removeChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
