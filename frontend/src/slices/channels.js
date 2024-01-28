/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

const initialState = {
  channels: [],
  activeChannel: 1,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    loadChannels: (state, { payload }) => {
      const { channels } = payload;
      state.channels = channels;
    },
    setActiveChannel: (state, { payload }) => {
      state.activeChannel = payload;
    },
    addNewChannel: (state, { payload }) => {
      state.channels = [...state.channels, payload];
    },
    removeChannel: (state, { payload }) => {
      state.channels = state.channels.filter(
        (channel) => channel.id !== payload,
      );
      state.activeChannel = 1;
    },
    renameChannel: (state, { payload }) => {
      const { id } = payload;
      const targetChannel = state.channels.filter((channel) => channel.id === id)[0];
      _.assign(targetChannel, payload);
    },
  },
});

export const {
  loadChannels,
  setActiveChannel,
  addNewChannel,
  removeChannel,
  renameChannel,
} = channelsSlice.actions;
export default channelsSlice.reducer;
