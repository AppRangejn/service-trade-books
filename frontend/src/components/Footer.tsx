'use client';

import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        bgcolor: 'background.paper',
        borderTop: '1px solid #e2e8f0',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoStoriesIcon color="primary" fontSize="small" />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              BooksTrade
            </Typography>
            <Typography variant="body2" color="text.secondary">
              — Community Book Exchange
            </Typography>
          </Box>

          <Stack direction="row" spacing={3}>
            <Link
              component={NextLink}
              href="/"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Home
            </Link>
            <Link
              component={NextLink}
              href="/books"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Catalog
            </Link>
            <Link
              component={NextLink}
              href="/me/books"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              My Books
            </Link>
          </Stack>

          <Typography variant="caption" color="text.secondary">
            © 2026 BooksTrade. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
