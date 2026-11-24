'use client';

import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from '@/api/authApi';
import { ForgotPasswordResponse } from '@/types';
import { getErrorMessage } from '@/utils/getErrorMessage';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/validation/schemas';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockResetIcon from '@mui/icons-material/LockReset';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialToken = searchParams.get('token') || '';

  const [step, setStep] = useState<'request' | 'reset'>(
    initialToken ? 'reset' : 'request',
  );
  const [requestResult, setRequestResult] =
    useState<ForgotPasswordResponse | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [forgotPassword, { isLoading: isSending, error: sendError }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting, error: resetError }] =
    useResetPasswordMutation();

  const requestFormik = useFormik({
    initialValues: { email: '' },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      try {
        const res = await forgotPassword({
          email: values.email.trim(),
        }).unwrap();
        setRequestResult(res);
        setStep('reset');
      } catch {
        // Handled sendError
      }
    },
  });

  const resetFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      token: initialToken,
      newPassword: '',
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      try {
        await resetPassword({
          token: values.token.trim(),
          newPassword: values.newPassword,
        }).unwrap();
        setResetSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      } catch {
        // Handled resetError
      }
    },
  });

  return (
    <Box sx={{ maxWidth: 460, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <LockResetIcon color="primary" fontSize="large" />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Password Recovery
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {step === 'request'
            ? 'Enter your account email to receive a password reset link and token.'
            : 'Paste the reset token from your email and choose a new password.'}
        </Typography>

        {requestResult && (
          <Alert severity="info" sx={{ mb: 2.5 }}>
            <Typography variant="body2">{requestResult.message}</Typography>
            {requestResult.previewUrl && (
              <Typography variant="body2" sx={{ mt: 0.75 }}>
                Ethereal Email Preview:{' '}
                <Link
                  href={requestResult.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open reset email
                </Link>
              </Typography>
            )}
          </Alert>
        )}

        {step === 'request' ? (
          <>
            {sendError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {getErrorMessage(sendError, 'Failed to send reset email')}
              </Alert>
            )}

            <Box
              key="request-form"
              component="form"
              onSubmit={requestFormik.handleSubmit}
              noValidate
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                fullWidth
                id="recovery-email"
                name="email"
                label="Account Email"
                type="email"
                autoComplete="email"
                value={requestFormik.values.email}
                onChange={requestFormik.handleChange}
                onBlur={requestFormik.handleBlur}
                error={
                  requestFormik.touched.email &&
                  Boolean(requestFormik.errors.email)
                }
                helperText={
                  requestFormik.touched.email && requestFormik.errors.email
                }
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSending}
              >
                {isSending ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <Button
                type="button"
                size="small"
                color="inherit"
                onClick={() => setStep('reset')}
              >
                Already have a reset token?
              </Button>
            </Box>
          </>
        ) : (
          <>
            {resetSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Password updated! Redirecting to login...
              </Alert>
            )}

            {resetError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {getErrorMessage(resetError, 'Failed to reset password')}
              </Alert>
            )}

            <Box
              key="reset-form"
              component="form"
              onSubmit={resetFormik.handleSubmit}
              autoComplete="off"
              noValidate
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                fullWidth
                multiline
                rows={2}
                id="reset-token"
                name="token"
                label="Reset Token"
                autoComplete="off"
                value={resetFormik.values.token}
                onChange={resetFormik.handleChange}
                onBlur={resetFormik.handleBlur}
                error={
                  resetFormik.touched.token && Boolean(resetFormik.errors.token)
                }
                helperText={
                  resetFormik.touched.token && resetFormik.errors.token
                }
              />

              <TextField
                fullWidth
                id="new-password"
                name="newPassword"
                label="New Password"
                type="password"
                autoComplete="new-password"
                value={resetFormik.values.newPassword}
                onChange={resetFormik.handleChange}
                onBlur={resetFormik.handleBlur}
                error={
                  resetFormik.touched.newPassword &&
                  Boolean(resetFormik.errors.newPassword)
                }
                helperText={
                  resetFormik.touched.newPassword &&
                  resetFormik.errors.newPassword
                }
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isResetting || resetSuccess}
              >
                {isResetting ? 'Updating...' : 'Set New Password'}
              </Button>

              <Button
                type="button"
                size="small"
                color="inherit"
                onClick={() => setStep('request')}
              >
                Request a new email
              </Button>
            </Box>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Button
            component={NextLink}
            href="/login"
            size="small"
            startIcon={<ArrowBackIcon />}
          >
            Back to Sign In
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
