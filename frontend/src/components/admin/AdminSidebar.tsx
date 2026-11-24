'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { logout } from '@/store/slices/authSlice';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export type AdminTab = 'users' | 'create';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  usersCount: number;
}

export const AdminSidebar = ({
  activeTab,
  onSelectTab,
  usersCount,
}: AdminSidebarProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <Paper
      sx={{
        width: { xs: '100%', md: 260 },
        flexShrink: 0,
        p: { xs: 2, md: 2.5 },
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: { md: 520 },
      }}
    >
      <Box>
        <Box
          sx={{
            textAlign: { xs: 'left', md: 'center' },
            py: { xs: 0.5, md: 1.5 },
            display: { xs: 'flex', md: 'block' },
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Welcome
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.name || 'Administrator'}
            </Typography>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              height: 2,
              width: 80,
              mx: 'auto',
              mt: 1.5,
              borderRadius: 1,
              background:
                'linear-gradient(90deg, transparent, #1e40af, transparent)',
            }}
          />
        </Box>

        <List
          sx={{
            mt: { xs: 1.5, md: 2 },
            p: 0,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: '1fr' },
            gap: 1,
          }}
        >
          <ListItemButton
            selected={activeTab === 'users'}
            onClick={() => onSelectTab('users')}
            sx={{
              borderRadius: 2,
              justifyContent: { xs: 'center', md: 'flex-start' },
              border: { xs: '1px solid #e2e8f0', md: 'none' },
              '&.Mui-selected': {
                bgcolor: 'rgba(30, 64, 175, 0.08)',
                color: 'primary.main',
                borderColor: 'primary.main',
                '& .MuiListItemIcon-root': { color: 'primary.main' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: { xs: 28, md: 36 } }}>
              <PeopleOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={`Users (${usersCount})`}
              sx={{ flex: { xs: 'initial', md: '1 1 auto' } }}
              slotProps={{
                primary: {
                  variant: 'body2',
                  sx: { fontWeight: 600 },
                },
              }}
            />
          </ListItemButton>

          <ListItemButton
            selected={activeTab === 'create'}
            onClick={() => onSelectTab('create')}
            sx={{
              borderRadius: 2,
              justifyContent: { xs: 'center', md: 'flex-start' },
              border: { xs: '1px solid #e2e8f0', md: 'none' },
              '&.Mui-selected': {
                bgcolor: 'rgba(30, 64, 175, 0.08)',
                color: 'primary.main',
                borderColor: 'primary.main',
                '& .MuiListItemIcon-root': { color: 'primary.main' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: { xs: 28, md: 36 } }}>
              <PersonAddAltIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Create User"
              sx={{ flex: { xs: 'initial', md: '1 1 auto' } }}
              slotProps={{
                primary: {
                  variant: 'body2',
                  sx: { fontWeight: 600 },
                },
              }}
            />
          </ListItemButton>

          <Divider sx={{ my: 1, display: { xs: 'none', md: 'block' } }} />

          <ListItemButton
            component={Link}
            href="/books"
            sx={{ borderRadius: 2, display: { xs: 'none', md: 'flex' } }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <AutoStoriesIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Books Catalog"
              slotProps={{ primary: { variant: 'body2' } }}
            />
          </ListItemButton>

          <ListItemButton
            component={Link}
            href="/me/books"
            sx={{ borderRadius: 2, display: { xs: 'none', md: 'flex' } }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <MenuBookIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="My Books"
              slotProps={{ primary: { variant: 'body2' } }}
            />
          </ListItemButton>
        </List>
      </Box>

      <Box sx={{ pt: 2, display: { xs: 'none', md: 'block' } }}>
        <Divider sx={{ mb: 1.5 }} />
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: 'error.main',
            '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.06)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: 'error.main' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            slotProps={{
              primary: {
                variant: 'body2',
                sx: { fontWeight: 600 },
              },
            }}
          />
        </ListItemButton>
      </Box>
    </Paper>
  );
};
