'use client';

import { useGetProfileQuery } from '@/api/profileApi';
import { IncomingRequestsList } from '@/components/profile/IncomingRequestsList';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { ProfileSummaryCard } from '@/components/profile/ProfileSummaryCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getErrorMessage } from '@/utils/getErrorMessage';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export default function ProfilePage() {
  const { data, isLoading, error } = useGetProfileQuery();
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const user = data?.user;
  const booksCount = data?.booksCount ?? 0;

  return (
    <ProtectedRoute>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <AccountCircleOutlinedIcon color="primary" fontSize="large" />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            My Profile
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {getErrorMessage(error, 'Failed to load profile')}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          user && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '300px 1fr' },
                gap: 3,
                alignItems: 'start',
              }}
            >
              <ProfileSummaryCard
                user={user}
                booksCount={booksCount}
                avatarPreview={avatarPreview}
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <ProfileEditForm
                  user={user}
                  onAvatarChange={setAvatarPreview}
                  onSuccess={setToastMessage}
                />

                <IncomingRequestsList
                  userEmail={user.email}
                  booksCount={booksCount}
                  onSuccess={setToastMessage}
                />
              </Box>
            </Box>
          )
        )}

        <Snackbar
          open={Boolean(toastMessage)}
          autoHideDuration={3500}
          onClose={() => setToastMessage(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setToastMessage(null)}
            severity="success"
            variant="filled"
          >
            {toastMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ProtectedRoute>
  );
}
