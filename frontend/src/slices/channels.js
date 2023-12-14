import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channels: {
    name: [],
    id: [],
    removable: [],
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
        state.channels.removable[ind] = item.removable;
      })
    },
    setActiveChannel: (state, action) => {
      const { payload } = action;
      state.activeChannel = payload;
    },
    addNewChannel: (state, action) => {
      const { payload } = action;
      const { name, id, removable } = payload;
      state.channels.name.push(name);
      state.channels.id.push(id);
      state.channels.removable.push(removable);
    },
  },
});

export const { renderChannels, setActiveChannel, addNewChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
