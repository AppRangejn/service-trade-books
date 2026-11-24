'use client';

import { USER_ROLES } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { logout } from '@/store/slices/authSlice';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';
import { HeaderBrand } from './header/HeaderBrand';
import { HeaderNav, NavItem } from './header/HeaderNav';
import { HeaderUserActions } from './header/HeaderUserActions';
import { MobileNavDrawer } from './header/MobileNavDrawer';

const emptySubscribe = () => () => {};

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const { user, token, isInitialized } = useAppSelector((state) => state.auth);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = Boolean(mounted && isInitialized && token && user);
  const isAdmin = Boolean(
    mounted && isInitialized && user?.role === USER_ROLES.ADMIN,
  );

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const navItems: NavItem[] = [
    { label: 'Home', href: '/', visible: true },
    { label: 'Catalog', href: '/books', visible: true },
    { label: 'My Books', href: '/me/books', visible: isAuthenticated },
    { label: 'Admin Panel', href: '/admin', visible: isAdmin },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              justifyContent: 'space-between',
              gap: 2,
              py: 1,
            }}
          >
            <HeaderBrand />
            <HeaderNav items={navItems} pathname={pathname} />
            <HeaderUserActions
              user={mounted ? user : null}
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              onLogout={handleLogout}
              onOpenMobileMenu={() => setMobileMenuOpen(true)}
            />
          </Toolbar>
        </Container>
      </AppBar>

      <MobileNavDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        items={navItems}
        pathname={pathname}
        user={mounted ? user : null}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
    </>
  );
};
