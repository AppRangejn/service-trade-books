'use client';

import { useGetProfileQuery, useUpdateProfileMutation } from '@/api/profileApi';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { USER_ROLES } from '@/constants';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { updateProfileSchema } from '@/validation/schemas';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import SaveIcon from '@mui/icons-material/Save';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useState } from 'react';

export default function ProfilePage() {
  const { data, isLoading, error } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating, error: updateError }] =
    useUpdateProfileMutation();

  const [avatarError, setAvatarError] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const user = data?.user;
  const booksCount = data?.booksCount ?? 0;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
    },
    validationSchema: updateProfileSchema,
    onSubmit: async (values) => {
      try {
        await updateProfile({
          name: values.name.trim(),
          email: values.email.trim(),
          avatar: values.avatar.trim() || null,
        }).unwrap();
        setAvatarError(false);
        setToastOpen(true);
      } catch {
        // Handled via updateError
      }
    },
  });

  const previewAvatar = formik.values.avatar.trim();

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
              {/* Left Column: Avatar & Stats */}
              <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
                <Avatar
                  src={
                    !avatarError && previewAvatar ? previewAvatar : undefined
                  }
                  alt={user.name}
                  slotProps={{
                    img: { onError: () => setAvatarError(true) },
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
                  color={
                    user.role === USER_ROLES.ADMIN ? 'secondary' : 'primary'
                  }
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
                  <Typography
                    variant="h4"
                    color="primary.main"
                    sx={{ fontWeight: 800 }}
                  >
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

              {/* Right Column: Edit Form + Exchange Notifications */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Paper
                  component="form"
                  onSubmit={formik.handleSubmit}
                  noValidate
                  sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 3 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Personal Information
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Update your display name, contact email, or profile avatar
                    URL
                  </Typography>

                  {updateError && (
                    <Alert severity="error" sx={{ mb: 2.5 }}>
                      {getErrorMessage(updateError, 'Failed to update profile')}
                    </Alert>
                  )}

                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      name="name"
                      label="Full Name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      name="email"
                      label="Email Address"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={formik.touched.email && formik.errors.email}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      name="avatar"
                      label="Avatar Image URL (optional)"
                      placeholder="https://example.com/avatar.jpg"
                      value={formik.values.avatar}
                      onChange={(e) => {
                        setAvatarError(false);
                        formik.handleChange(e);
                      }}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.avatar && Boolean(formik.errors.avatar)
                      }
                      helperText={formik.touched.avatar && formik.errors.avatar}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Box>
                  </Box>
                </Paper>

                <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 1.5,
                    }}
                  >
                    <MarkEmailReadOutlinedIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Exchange Request Notifications
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Email notifications are active. Whenever another reader
                    requests one of your {booksCount} listed{' '}
                    {booksCount === 1 ? 'book' : 'books'}, an instant message
                    with their contact details and available books is sent to{' '}
                    <strong>{user.email}</strong>.
                  </Typography>
                </Paper>
              </Box>
            </Box>
          )
        )}

        <Snackbar
          open={toastOpen}
          autoHideDuration={3500}
          onClose={() => setToastOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setToastOpen(false)}
            severity="success"
            variant="filled"
          >
            Profile updated successfully
          </Alert>
        </Snackbar>
      </Box>
    </ProtectedRoute>
  );
}
