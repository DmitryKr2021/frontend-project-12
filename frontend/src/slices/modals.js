/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  typeModal: null,
  showModal: false,
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
      state.typeModal = null;
      state.showModal = false;
    },
  },
});

export const { chooseModal, closeModal } = modalsSlice.actions;
export default modalsSlice.reducer;
