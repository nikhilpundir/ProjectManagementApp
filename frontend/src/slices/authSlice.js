import { createSlice } from '@reduxjs/toolkit';

// Retrieve initial state from localStorage if available
const initialState = (() => {
  const storedAuth = localStorage.getItem('auth');
  if (storedAuth) {
    const { isAuthenticated, user } = JSON.parse(storedAuth);
    return { isAuthenticated, user };
  }
  return { isAuthenticated: false, user: null }; // Default state
})();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      
      // Save to localStorage
      localStorage.setItem('auth', JSON.stringify({
        isAuthenticated: true,
        user: action.payload,
      }));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      
      // Remove from localStorage
      localStorage.removeItem('auth');
    },
  },
});

export const { login, logout } = authSlice.actions;

// Selector to access authentication state
export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
