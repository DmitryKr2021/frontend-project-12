/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  typeModal: null,
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    chooseModal: (state, { payload }) => {
      state.typeModal = payload;
    },
    closeModal: (state) => {
      state.typeModal = null;
    },
  },
});

export const { chooseModal, closeModal } = modalsSlice.actions;
export default modalsSlice.reducer;
