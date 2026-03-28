import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice.js';
import { saveState, loadState } from "./localStorageUtils";

// Load persisted state from localStorage
let preloadedState = loadState();

if (preloadedState && preloadedState.auth) {
  preloadedState.auth.loginLoading = false;
  preloadedState.auth.loading = false;
  preloadedState.auth.registerOtpLoading = false;
  preloadedState.auth.verifyRegisterOtpLoading = false;
  preloadedState.auth.otpLoading = false;
}

const store = configureStore({
  reducer: {
    auth: authReducer
  },
  preloadedState,
});

// Save Redux state to localStorage on changes
store.subscribe(() => {
  const authState = store.getState().auth;
  saveState({
    auth: {
      token: authState.token,
      admin: authState.admin,
      _id: authState._id,
      email: authState.email,
      role: authState.role,
      // specifically omitting loading, error, and UI states
    }
  });
});


export default store;