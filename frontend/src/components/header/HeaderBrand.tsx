'use client';

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export const HeaderBrand = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box
        component={Link}
        href="/"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          textDecoration: 'none',
          color: 'text.primary',
        }}
      >
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: '#fff',
            px: 1,
            py: 0.4,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <AutoStoriesIcon fontSize="small" />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}
        >
          BOOKSTRADE
        </Typography>
      </Box>

      <Button
        component={Link}
        href="/books"
        startIcon={<MenuBookIcon fontSize="small" />}
        sx={{
          display: { xs: 'none', lg: 'inline-flex' },
          bgcolor: '#f1f5f9',
          color: 'text.primary',
          borderRadius: 2.5,
          px: 2,
          py: 0.8,
          fontWeight: 600,
          fontSize: '0.875rem',
          border: '1px solid #e2e8f0',
          '&:hover': {
            bgcolor: '#e2e8f0',
          },
        }}
      >
        Library
      </Button>
    </Box>
  );
};
