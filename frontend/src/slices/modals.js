/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modal: null,
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    chooseModal: (state, { payload }) => {
      state.modal = payload;
    },
    closeModal: (state) => {
      state.modal = null;
    },
  },
});

export const { chooseModal, closeModal } = modalsSlice.actions;
export default modalsSlice.reducer;
