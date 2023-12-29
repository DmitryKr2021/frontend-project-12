import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash'

const initialState = {
  channels: [],
  activeChannel: 1,
};

const channelsSlice = createSlice({
  name: 'channels',
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
      const newChannels = state.channels.filter(channel => channel.id !== payload)
      state.channels = [...newChannels];
    },
    renameChannel: (state, action) => {
      const { payload } = action;
      const { id } = payload;
      for (let channel of state.channels) {
        if (channel.id === id) {
          _.assign(channel, payload)
        }
      }
    },
  },
});

export const { renderChannels, setActiveChannel, addNewChannel, removeChannel, renameChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
