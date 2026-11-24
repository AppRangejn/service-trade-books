'use client';

import { useGetMeQuery } from '@/api/authApi';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { hydrateAuth } from './slices/authSlice';

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { token, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useGetMeQuery(undefined, {
    skip: !token || isInitialized,
  });

  return <>{children}</>;
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
};
