'use client';

import { User } from '@/types';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useState } from 'react';

interface HeaderUserActionsProps {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogout: () => void;
  onOpenMobileMenu: () => void;
}

export const HeaderUserActions = ({
  user,
  isAuthenticated,
  isAdmin,
  onLogout,
  onOpenMobileMenu,
}: HeaderUserActionsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.currentTarget.blur();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleCloseMenu();
    onLogout();
  };

  const handleMobileMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.currentTarget.blur();
    onOpenMobileMenu();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton
        component={Link}
        href="/books"
        aria-label="Search books"
        sx={{
          bgcolor: '#f1f5f9',
          border: '1px solid #e2e8f0',
          borderRadius: 2.5,
          width: 40,
          height: 40,
          color: 'text.secondary',
          '&:hover': {
            bgcolor: '#e2e8f0',
            color: 'text.primary',
          },
        }}
      >
        <SearchIcon fontSize="small" />
      </IconButton>

      {isAuthenticated && user ? (
        <>
          <Button
            onClick={handleOpenMenu}
            startIcon={
              user.avatar ? (
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{ width: 24, height: 24 }}
                />
              ) : (
                <PersonOutlineOutlinedIcon fontSize="small" />
              )
            }
            endIcon={<KeyboardArrowDownIcon fontSize="small" />}
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              bgcolor: 'primary.main',
              color: '#fff',
              borderRadius: 2.5,
              px: 2,
              height: 40,
              fontWeight: 600,
              maxWidth: 200,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            <Typography
              variant="body2"
              noWrap
              sx={{ fontWeight: 600, color: 'inherit' }}
            >
              {user.name}
            </Typography>
          </Button>

          <Chip
            label={user.role}
            size="small"
            color={isAdmin ? 'secondary' : 'default'}
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              height: 40,
              borderRadius: 2.5,
              px: 0.75,
              fontWeight: 700,
              bgcolor: isAdmin ? 'secondary.main' : '#f1f5f9',
              color: isAdmin ? '#fff' : 'text.primary',
              border: isAdmin ? 'none' : '1px solid #e2e8f0',
            }}
          />

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            disableRestoreFocus
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                sx: { mt: 1, minWidth: 190, borderRadius: 2.5 },
              },
            }}
          >
            <MenuItem
              component={Link}
              href="/profile"
              onClick={handleCloseMenu}
            >
              <ListItemIcon>
                <AccountCircleOutlinedIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>

            <MenuItem
              component={Link}
              href="/me/books"
              onClick={handleCloseMenu}
            >
              <ListItemIcon>
                <MenuBookIcon fontSize="small" />
              </ListItemIcon>
              My Books
            </MenuItem>

            {isAdmin && (
              <MenuItem
                component={Link}
                href="/admin"
                onClick={handleCloseMenu}
              >
                <ListItemIcon>
                  <ShieldOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Admin Panel
              </MenuItem>
            )}

            <Divider />

            <MenuItem onClick={handleLogoutClick} sx={{ color: 'error.main' }}>
              <ListItemIcon sx={{ color: 'error.main' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
          <Button
            component={Link}
            href="/login"
            sx={{
              bgcolor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: 'text.primary',
              borderRadius: 2.5,
              px: 2,
              height: 40,
              '&:hover': { bgcolor: '#e2e8f0' },
            }}
          >
            Login
          </Button>
          <Button
            component={Link}
            href="/register"
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2.5,
              px: 2.25,
              height: 40,
            }}
          >
            Register
          </Button>
        </Box>
      )}

      <IconButton
        onClick={handleMobileMenuClick}
        aria-label="Open navigation menu"
        sx={{
          display: { xs: 'inline-flex', md: 'none' },
          bgcolor: '#f1f5f9',
          border: '1px solid #e2e8f0',
          borderRadius: 2.5,
          width: 40,
          height: 40,
          color: 'text.primary',
          '&:hover': { bgcolor: '#e2e8f0' },
        }}
      >
        <MenuIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};
