import { baseApi } from '@/api/baseApi';
import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import authReducer from './slices/authSlice';

const isDev = process.env.NODE_ENV === 'development';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware().concat(baseApi.middleware);

    if (isDev && typeof window !== 'undefined') {
      return middleware.concat(
        createLogger({
          collapsed: true,
        }),
      );
    }

    return middleware;
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
