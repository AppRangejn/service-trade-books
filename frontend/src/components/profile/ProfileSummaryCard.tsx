'use client';

import { USER_ROLES } from '@/constants';
import { User } from '@/types';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useState } from 'react';

interface ProfileSummaryCardProps {
  user: User;
  booksCount: number;
  avatarPreview?: string;
}

export function ProfileSummaryCard({
  user,
  booksCount,
  avatarPreview,
}: ProfileSummaryCardProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const effectiveSrc = (avatarPreview ?? user.avatar ?? '').trim();
  const showImage = Boolean(effectiveSrc) && failedSrc !== effectiveSrc;

  return (
    <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
      <Avatar
        src={showImage ? effectiveSrc : undefined}
        alt={user.name}
        slotProps={{
          img: { onError: () => setFailedSrc(effectiveSrc) },
        }}
        sx={{
          width: 96,
          height: 96,
          mx: 'auto',
          mb: 2,
          bgcolor: 'primary.main',
          fontSize: '2.25rem',
          fontWeight: 700,
        }}
      >
        {user.name.charAt(0).toUpperCase()}
      </Avatar>

      <Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>
        {user.name}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1.5, wordBreak: 'break-all' }}
      >
        {user.email}
      </Typography>

      <Chip
        label={user.role}
        size="small"
        color={user.role === USER_ROLES.ADMIN ? 'secondary' : 'primary'}
        sx={{ fontWeight: 700 }}
      />

      <Divider sx={{ my: 2.5 }} />

      <Box
        sx={{
          p: 2,
          borderRadius: 2.5,
          bgcolor: '#f8fafc',
          border: '1px solid #e2e8f0',
        }}
      >
        <Typography variant="h4" color="primary.main" sx={{ fontWeight: 800 }}>
          {booksCount}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Books on your shelf
        </Typography>
        <Button
          component={Link}
          href="/me/books"
          size="small"
          startIcon={<AutoStoriesIcon fontSize="small" />}
          sx={{ mt: 1.5 }}
        >
          Manage My Books
        </Button>
      </Box>
    </Paper>
  );
}
