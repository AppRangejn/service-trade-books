'use client';

import { User } from '@/types';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { NavItem } from './HeaderNav';

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  pathname: string;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

export const MobileNavDrawer = ({
  open,
  onClose,
  items,
  pathname,
  user,
  isAuthenticated,
  isAdmin,
  onLogout,
}: MobileNavDrawerProps) => {
  const handleCloseDrawer = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onClose();
  };

  const handleLogoutClick = () => {
    handleCloseDrawer();
    onLogout();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleCloseDrawer}
      disableRestoreFocus
      slotProps={{
        paper: {
          sx: {
            width: 280,
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
        },
      }}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoStoriesIcon color="primary" fontSize="small" />
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              BOOKSTRADE
            </Typography>
          </Box>
          <IconButton
            onClick={handleCloseDrawer}
            size="small"
            aria-label="Close menu"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {isAuthenticated && user && (
          <Box
            component={Link}
            href="/profile"
            onClick={handleCloseDrawer}
            sx={{
              p: 1.5,
              mb: 2,
              borderRadius: 2.5,
              bgcolor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': { bgcolor: '#e2e8f0' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                minWidth: 0,
              }}
            >
              <Avatar
                src={user.avatar || undefined}
                alt={user.name}
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: 'primary.main',
                  fontSize: 14,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                  {user.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block' }}
                  noWrap
                >
                  {user.email}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={user.role}
              size="small"
              color={isAdmin ? 'secondary' : 'default'}
              sx={{ fontWeight: 600 }}
            />
          </Box>
        )}

        <Divider sx={{ mb: 1.5 }} />

        <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {items
            .filter((item) => item.visible)
            .map((item) => {
              const isActive = pathname === item.href;
              return (
                <ListItemButton
                  key={item.href}
                  component={Link}
                  href={item.href}
                  selected={isActive}
                  onClick={handleCloseDrawer}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(30, 64, 175, 0.08)',
                      color: 'primary.main',
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        variant: 'body2',
                        sx: { fontWeight: isActive ? 700 : 500 },
                      },
                    }}
                  />
                </ListItemButton>
              );
            })}
        </List>
      </Box>

      <Box sx={{ pt: 2 }}>
        <Divider sx={{ mb: 2 }} />
        {isAuthenticated ? (
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogoutClick}
            sx={{ borderRadius: 2.5 }}
          >
            Logout
          </Button>
        ) : (
          <Stack spacing={1.5}>
            <Button
              fullWidth
              component={Link}
              href="/login"
              variant="outlined"
              startIcon={<LoginIcon />}
              onClick={handleCloseDrawer}
              sx={{ borderRadius: 2.5 }}
            >
              Login
            </Button>
            <Button
              fullWidth
              component={Link}
              href="/register"
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleCloseDrawer}
              sx={{ borderRadius: 2.5 }}
            >
              Register
            </Button>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
};
