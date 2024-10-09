import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  isAuthenticated: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      const { username, firstName, lastName, email } = action.payload;
      state.username = username;
      state.firstName = firstName;
      state.lastName = lastName;
      state.email = email;
    },
    clearUserInfo: (state) => {
      state.username = '';
      state.firstName = '';
      state.lastName = '';
      state.email = '';
    },
    authenticateUser: (state) => {
      state.isAuthenticated = true;
    },
    deauthenticateUser: (state) => {
      state.isAuthenticated = false;
    },
  }
});

export const { setUserInfo, authenticateUser, clearUserInfo, deauthenticateUser } = userSlice.actions;
export default userSlice.reducer;
