import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  companyId: null,
  companyName: null,
  companyAddress: null,
  userName: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { userId, companyId, companyAddress, companyName, userName } = action.payload;
      state.userId = userId;
      state.companyId = companyId;
      state.companyName = companyName;
      state.companyAddress = companyAddress;
      state.userName = userName;
    },
    logoutUser: (state) => {
      state.userId = null;
      state.companyId = null;
      state.companyName = null;
      state.companyAddress = null;
      state.userName = null;
    },
  },
});

export const { setUser, logoutUser } = loginSlice.actions;
export default loginSlice.reducer;
