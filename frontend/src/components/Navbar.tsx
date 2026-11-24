'use client';

import { USER_ROLES } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { logout } from '@/store/slices/authSlice';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);

  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const navButtonSx = (path: string) => ({
    color: 'inherit',
    fontWeight: pathname === path ? 700 : 400,
    borderBottom:
      pathname === path ? '2px solid #fff' : '2px solid transparent',
    borderRadius: 0,
    px: 1.5,
  });

  return (
    <AppBar position="sticky" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 1, flexWrap: 'wrap', py: 0.5 }}>
          <Box
            component={Link}
            href="/books"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: 'inherit',
              mr: 2,
            }}
          >
            <AutoStoriesIcon />
            <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
              BookSwap
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              flexGrow: 1,
            }}
          >
            <Button component={Link} href="/books" sx={navButtonSx('/books')}>
              Catalog
            </Button>

            {isAuthenticated && (
              <Button
                component={Link}
                href="/me/books"
                sx={navButtonSx('/me/books')}
              >
                My Books
              </Button>
            )}

            {isAdmin && (
              <Button component={Link} href="/admin" sx={navButtonSx('/admin')}>
                Admin Panel
              </Button>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {isAuthenticated && user ? (
              <>
                <Typography
                  variant="body2"
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                  {user.name}
                </Typography>
                <Chip
                  label={user.role}
                  size="small"
                  color={isAdmin ? 'secondary' : 'default'}
                  sx={{
                    bgcolor: isAdmin
                      ? 'secondary.main'
                      : 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontWeight: 600,
                  }}
                />
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} href="/login" color="inherit">
                  Login
                </Button>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  color="secondary"
                  size="small"
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
