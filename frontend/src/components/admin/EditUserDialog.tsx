'use client';

import { useUpdateUserMutation } from '@/api/adminApi';
import { USER_ROLES, UserRole } from '@/constants';
import { User } from '@/types';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { updateUserAdminSchema } from '@/validation/schemas';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import { useEffect } from 'react';

interface EditUserDialogProps {
  user: User | null;
  onClose: () => void;
  onSuccess?: (userName: string) => void;
}

export const EditUserDialog = ({
  user,
  onClose,
  onSuccess,
}: EditUserDialogProps) => {
  const [updateUser, { isLoading, error }] = useUpdateUserMutation();

  useEffect(() => {
    if (user && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [user]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      role: (user?.role || USER_ROLES.USER) as UserRole,
    },
    validationSchema: updateUserAdminSchema,
    onSubmit: async (values) => {
      if (!user) return;
      try {
        const cleanName = values.name.trim();
        await updateUser({
          id: user.id,
          data: {
            name: cleanName,
            email: values.email.trim(),
            role: values.role,
            ...(values.password ? { password: values.password } : {}),
          },
        }).unwrap();
        onClose();
        onSuccess?.(cleanName);
      } catch {
        // Handled error state
      }
    },
  });

  return (
    <Dialog
      open={Boolean(user)}
      onClose={isLoading ? undefined : onClose}
      disableRestoreFocus
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Edit User</DialogTitle>
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
        >
          {error && (
            <Alert severity="error">
              {getErrorMessage(error, 'Failed to update user')}
            </Alert>
          )}

          <Box>
            <Typography
              variant="caption"
              sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}
            >
              Full Name
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}
            >
              Email
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}
            >
              New Password (leave blank to keep current)
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}
            >
              Role
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
              >
                <MenuItem value={USER_ROLES.USER}>User</MenuItem>
                <MenuItem value={USER_ROLES.ADMIN}>Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} disabled={isLoading} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
