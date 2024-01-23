/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showModal: false,
  typeModal: null,
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    chooseModal: (state, { payload }) => {
      state.typeModal = payload;
      state.showModal = true;
    },
    closeModal: (state) => {
      state.showModal = false;
      state.typeModal = null;
    },
  },
});

export const { chooseModal, closeModal } = modalsSlice.actions;
export default modalsSlice.reducer;
