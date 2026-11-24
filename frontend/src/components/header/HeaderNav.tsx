'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';

export interface NavItem {
  label: string;
  href: string;
  visible: boolean;
}

interface HeaderNavProps {
  items: NavItem[];
  pathname: string;
}

export const HeaderNav = ({ items, pathname }: HeaderNavProps) => {
  return (
    <Box
      component="nav"
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        gap: 0.5,
        bgcolor: '#f1f5f9',
        border: '1px solid #e2e8f0',
        borderRadius: 3,
        px: 1.5,
        py: 0.5,
      }}
    >
      {items
        .filter((item) => item.visible)
        .map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              component={Link}
              href={item.href}
              size="small"
              sx={{
                px: 1.75,
                py: 0.6,
                borderRadius: 2,
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'primary.main' : 'text.secondary',
                bgcolor: isActive ? '#ffffff' : 'transparent',
                boxShadow: isActive
                  ? '0 1px 2px rgba(15, 23, 42, 0.06)'
                  : 'none',
                '&:hover': {
                  color: 'text.primary',
                  bgcolor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                },
              }}
            >
              {item.label}
            </Button>
          );
        })}
    </Box>
  );
};
