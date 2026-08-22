import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  user: null,
  isAuthenticated: false,
  role: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserRole: (state, action) => {
      state.role = action.payload;
      if (state.user) {
        state.user.role = action.payload;
      }
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.user.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.role = 'farmer';
      state.isAuthenticated = false;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    toggleOwnerMode: (state, action) => {
      if (state.user) {
        state.user.isOwnerEnabled = action.payload;
        if (action.payload) {
          state.role = 'owner';
        } else {
          state.role = 'farmer';
        }
      }
    }
  },
});

export const { setUserRole, loginSuccess, logout, updateProfile, toggleOwnerMode } = authSlice.actions;
export default authSlice.reducer;
