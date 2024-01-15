/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

const initialState = {
  modal: null,
  channels: [],
  activeChannel: 1,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    showChannels: (state, { payload }) => {
      const { channels } = payload;
      state.channels = [...channels];
    },
    setActiveChannel: (state, { payload }) => {
      state.activeChannel = payload;
    },
    chooseModal: (state, { payload }) => {
      state.modal = payload;
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
      state.modal = null;
    },
  },
});

export const {
  showChannels,
  setActiveChannel,
  addNewChannel,
  removeChannel,
  renameChannel,
  chooseModal,
} = channelsSlice.actions;
export default channelsSlice.reducer;
