'use client';

import { useAppSelector } from '@/hooks/useRedux';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

const STEPS = [
  {
    icon: <SearchIcon color="primary" sx={{ fontSize: 36 }} />,
    title: '1. Browse the Catalog',
    description:
      'Search books by title or author and explore what community members are currently sharing.',
  },
  {
    icon: <AutoStoriesIcon color="primary" sx={{ fontSize: 36 }} />,
    title: '2. List Your Books',
    description:
      'Add books from your personal shelf so other readers can see what you offer in return.',
  },
  {
    icon: <SwapHorizIcon color="primary" sx={{ fontSize: 36 }} />,
    title: '3. Request an Exchange',
    description:
      'Send an instant email exchange request to the book owner with your contact details and book list.',
  },
];

export default function HomePage() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const { user, token, isInitialized } = useAppSelector((state) => state.auth);

  const isAuthenticated = Boolean(mounted && isInitialized && token && user);

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          mb: 5,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #1e40af 0%, #0f766e 100%)',
          color: '#fff',
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 700 }}
          gutterBottom
        >
          Share Books. Discover New Stories.
        </Typography>
        <Typography
          variant="h6"
          sx={{ maxWidth: 640, mb: 4, opacity: 0.9, fontWeight: 400 }}
        >
          BooksTrade is a community book exchange platform where readers trade
          books directly with each other — simple, free, and sustainable.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            component={Link}
            href="/books"
            variant="contained"
            size="large"
            startIcon={<AutoStoriesIcon />}
            sx={{
              bgcolor: '#fff',
              color: 'primary.main',
              fontWeight: 600,
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            Explore Catalog
          </Button>

          {isAuthenticated ? (
            <Button
              component={Link}
              href="/me/books"
              variant="outlined"
              size="large"
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  borderColor: '#fff',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Manage My Books
            </Button>
          ) : (
            <Button
              component={Link}
              href="/register"
              variant="outlined"
              size="large"
              startIcon={<PersonAddIcon />}
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  borderColor: '#fff',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Join the Club
            </Button>
          )}
        </Stack>
      </Paper>

      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }} gutterBottom>
        How It Works
      </Typography>

      <Grid container spacing={3}>
        {STEPS.map((step) => (
          <Grid key={step.title} size={{ xs: 12, md: 4 }}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              {step.icon}
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {step.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
