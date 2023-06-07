import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
  userId: null,
  companyId: null,
  userName: null,
  email: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { userId, companyId, userName, email } = action.payload;
      state.userId = userId;
      state.companyId = companyId;
      state.userName = userName;
      state.email = email;
    },
    logoutUser: (state) => {
      state.userId = null;
      state.companyId = null;
      state.userName = null;
      state.email = null;
    },
  },
});

const persistConfig = {
  key: 'login',
  storage,
};

const persistedLoginSlice = persistReducer(persistConfig, loginSlice.reducer);

export const { setUser, logoutUser } = loginSlice.actions;
export const loginReducer = persistedLoginSlice;

export default loginSlice.reducer;
