import { authApi } from '@/api/authApi';
import {
  AUTH_SLICE_NAME,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from '@/constants';
import { User } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: User | null;
  token: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: AUTH_SLICE_NAME,
  initialState,
  reducers: {
    hydrateAuth: (state) => {
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);

        state.token = storedToken || null;
        if (storedUser) {
          try {
            state.user = JSON.parse(storedUser) as User;
          } catch {
            localStorage.removeItem(USER_STORAGE_KEY);
          }
        }
        if (!storedToken) {
          state.isInitialized = true;
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isInitialized = true;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.token = payload.token;
          state.isInitialized = true;
          if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_STORAGE_KEY, payload.token);
            localStorage.setItem(
              USER_STORAGE_KEY,
              JSON.stringify(payload.user),
            );
          }
        },
      )
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.token = payload.token;
          state.isInitialized = true;
          if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_STORAGE_KEY, payload.token);
            localStorage.setItem(
              USER_STORAGE_KEY,
              JSON.stringify(payload.user),
            );
          }
        },
      )
      .addMatcher(
        authApi.endpoints.getMe.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.isInitialized = true;
          if (typeof window !== 'undefined') {
            localStorage.setItem(
              USER_STORAGE_KEY,
              JSON.stringify(payload.user),
            );
          }
        },
      )
      .addMatcher(authApi.endpoints.getMe.matchRejected, (state) => {
        state.user = null;
        state.token = null;
        state.isInitialized = true;
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      });
  },
});

export const { hydrateAuth, logout } = authSlice.actions;
export default authSlice.reducer;
