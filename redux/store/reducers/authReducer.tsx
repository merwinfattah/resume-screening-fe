import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;

      // Save only the token to localStorage
      localStorage.setItem('token', JSON.stringify(action.payload));
    },
    clearToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem('token');
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;
