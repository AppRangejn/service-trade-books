'use client';

import { useCreateUserMutation } from '@/api/adminApi';
import { USER_ROLES, UserRole } from '@/constants';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { createUserAdminSchema } from '@/validation/schemas';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';

interface CreateUserFormProps {
  onSuccess?: (userName: string) => void;
}

export const CreateUserForm = ({ onSuccess }: CreateUserFormProps) => {
  const [createUser, { isLoading, error }] = useCreateUserMutation();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: USER_ROLES.USER as UserRole,
    },
    validationSchema: createUserAdminSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const cleanName = values.name.trim();
        await createUser({
          name: cleanName,
          email: values.email.trim(),
          password: values.password,
          role: values.role,
        }).unwrap();
        resetForm();
        onSuccess?.(cleanName);
      } catch {
        // Handled error state
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate>
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddIcon color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Create New User
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ flex: { xs: 1, sm: 'initial' } }}
          >
            {isLoading ? 'Creating...' : 'Create User'}
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="inherit"
            disabled={isLoading}
            onClick={() => formik.resetForm()}
            sx={{ flex: { xs: 1, sm: 'initial' } }}
          >
            Cancel
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {getErrorMessage(error, 'Failed to create user')}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, borderRadius: 3 }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mb: 2.5, fontWeight: 600 }}
        >
          Account Details
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2.5,
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{ display: 'block', mb: 0.75, fontWeight: 600 }}
            >
              Full Name *
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="name"
              placeholder="Enter full name"
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
              sx={{ display: 'block', mb: 0.75, fontWeight: 600 }}
            >
              Email Address *
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="email"
              placeholder="user@example.com"
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
              sx={{ display: 'block', mb: 0.75, fontWeight: 600 }}
            >
              Role *
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
        </Box>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mb: 2.5, fontWeight: 600 }}
        >
          Security Credentials
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2.5,
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{ display: 'block', mb: 0.75, fontWeight: 600 }}
            >
              Initial Password *
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
