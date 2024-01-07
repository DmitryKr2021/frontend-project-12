/* eslint-disable*/
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

const initialState = {
  users: [],
  activeUser: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      const { payload } = action;
      const { username } = payload;
      state.activeUser = username;
    },
    addNewUser: (state, action) => {
        const { payload } = action;
        const { username } = payload;
        const uniqName = _.uniqueId(username);
        state.users = [...state.users, uniqName];
        window.localStorage.setItem(uniqName, JSON.stringify(payload));
    },
    loginUser: (state, action) => {
      const { payload } = action;
      const { username } = payload;
      const uniqName = _.uniqueId(username);
      state.users = [...state.users, uniqName];
      window.localStorage.setItem(uniqName, JSON.stringify(payload));
    },
  },
});

export const {
  setActiveUser,
  addNewUser,
  loginUser,
} = usersSlice.actions;
export default usersSlice.reducer;
