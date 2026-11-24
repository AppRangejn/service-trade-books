'use client';

import { USER_ROLES } from '@/constants';
import { useAppSelector } from '@/hooks/useRedux';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const router = useRouter();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const { user, token, isInitialized } = useAppSelector((state) => state.auth);

  const isReady = mounted && isInitialized;

  useEffect(() => {
    if (!isReady) return;

    if (!token || !user) {
      router.replace('/login');
      return;
    }

    if (requireAdmin && user.role !== USER_ROLES.ADMIN) {
      router.replace('/books');
    }
  }, [isReady, token, user, requireAdmin, router]);

  if (!isReady || !token || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (requireAdmin && user.role !== USER_ROLES.ADMIN) {
    return null;
  }

  return <>{children}</>;
};
