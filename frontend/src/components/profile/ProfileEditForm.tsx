'use client';

import { useUpdateProfileMutation } from '@/api/profileApi';
import { User } from '@/types';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { updateProfileSchema } from '@/validation/schemas';
import SaveIcon from '@mui/icons-material/Save';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import { useEffect } from 'react';

interface ProfileEditFormProps {
  user: User;
  onAvatarChange: (url: string) => void;
  onSuccess: (message: string) => void;
}

export function ProfileEditForm({
  user,
  onAvatarChange,
  onSuccess,
}: ProfileEditFormProps) {
  const [updateProfile, { isLoading, error }] = useUpdateProfileMutation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user.name || '',
      email: user.email || '',
      avatar: user.avatar || '',
    },
    validationSchema: updateProfileSchema,
    onSubmit: async (values) => {
      try {
        await updateProfile({
          name: values.name.trim(),
          email: values.email.trim(),
          avatar: values.avatar.trim() || null,
        }).unwrap();
        onSuccess('Profile updated successfully');
      } catch {
        // Handled via error
      }
    },
  });

  useEffect(() => {
    onAvatarChange(formik.values.avatar);
  }, [formik.values.avatar, onAvatarChange]);

  return (
    <Paper
      component="form"
      onSubmit={formik.handleSubmit}
      noValidate
      sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 3 }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
        Personal Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Update your display name, contact email, or profile avatar URL
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5 }}>
          {getErrorMessage(error, 'Failed to update profile')}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <TextField
          fullWidth
          size="small"
          name="avatar"
          label="Avatar Image URL (optional)"
          placeholder="https://example.com/avatar.jpg"
          value={formik.values.avatar}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.avatar && Boolean(formik.errors.avatar)}
          helperText={formik.touched.avatar && formik.errors.avatar}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
