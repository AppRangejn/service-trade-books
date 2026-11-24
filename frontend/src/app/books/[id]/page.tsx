'use client';

import {
  useDeleteBookMutation,
  useGetBookByIdQuery,
  useRequestExchangeMutation,
} from '@/api/booksApi';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { USER_ROLES } from '@/constants';
import { useAppSelector } from '@/hooks/useRedux';
import { ExchangeResponse } from '@/types';
import { getErrorMessage } from '@/utils/getErrorMessage';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';

function BookDetailsContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const bookId = Number(params.id);

  const [imgError, setImgError] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [exchangeResult, setExchangeResult] = useState<ExchangeResponse | null>(
    null,
  );

  const { user, token, isInitialized } = useAppSelector((state) => state.auth);
  const isAuthenticated = Boolean(isInitialized && token && user);

  const { data, isLoading, error } = useGetBookByIdQuery(bookId, {
    skip: Number.isNaN(bookId),
  });

  const [requestExchange, { isLoading: isRequesting, error: exchangeError }] =
    useRequestExchangeMutation();

  const [deleteBook, { isLoading: isDeleting, error: deleteError }] =
    useDeleteBookMutation();

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={140} height={36} sx={{ mb: 3 }} />
        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 3, md: 4 },
            }}
          >
            <Skeleton
              variant="rectangular"
              sx={{
                width: { xs: 220, sm: 240, md: 280 },
                aspectRatio: '3 / 4',
                height: 'auto',
                borderRadius: 2,
                flexShrink: 0,
              }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="60%" height={44} />
              <Skeleton variant="text" width="35%" height={28} sx={{ mb: 3 }} />
              <Skeleton variant="text" width="45%" height={24} />
              <Skeleton variant="text" width="30%" height={20} />
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  }

  if (error || !data?.book) {
    return (
      <Box>
        <Button
          component={NextLink}
          href="/books"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Catalog
        </Button>
        <Alert severity="error">
          {getErrorMessage(error, 'Book not found')}
        </Alert>
      </Box>
    );
  }

  const { book } = data;
  const isOwner = Boolean(isInitialized && user && book.userId === user.id);
  const isAdmin = Boolean(isInitialized && user?.role === USER_ROLES.ADMIN);
  const canDelete = isOwner || isAdmin;

  const handleExchange = async () => {
    setExchangeResult(null);
    try {
      const result = await requestExchange(book.id).unwrap();
      setExchangeResult(result);
    } catch {
      // Handled exchangeError
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteBook(book.id).unwrap();
      setConfirmOpen(false);
      router.push('/books');
    } catch {
      // Handled deleteError
    }
  };

  return (
    <Box>
      <Button
        component={NextLink}
        href="/books"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Back to Catalog
      </Button>

      <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 3, md: 4 },
            alignItems: 'flex-start',
          }}
        >
          <Box
            sx={{
              width: { xs: 220, sm: 240, md: 280 },
              flexShrink: 0,
            }}
          >
            {book.photo && !imgError ? (
              <Box
                component="img"
                src={book.photo}
                alt={book.name}
                onError={() => setImgError(true)}
                sx={{
                  width: '100%',
                  aspectRatio: '3 / 4',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  aspectRatio: '3 / 4',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#f1f5f9',
                  color: 'text.secondary',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  gap: 1,
                }}
              >
                <MenuBookIcon sx={{ fontSize: 56, opacity: 0.6 }} />
                <Typography variant="body2">No cover image</Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignSelf: 'stretch',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 1,
                flexWrap: 'wrap',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {book.name}
              </Typography>
              {isOwner && (
                <Chip label="Your Book" color="primary" size="small" />
              )}
            </Box>

            <Typography variant="h6" color="text.secondary" gutterBottom>
              by {book.author}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Owner:</strong> {book.owner?.name || 'Community Member'}
            </Typography>

            {book.createdAt && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Added on {new Date(book.createdAt).toLocaleDateString()}
              </Typography>
            )}

            {exchangeResult && (
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {exchangeResult.message}
                </Typography>
                {exchangeResult.previewUrl && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Ethereal Email Preview:{' '}
                    <Link
                      href={exchangeResult.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open sent email
                    </Link>
                  </Typography>
                )}
              </Alert>
            )}

            {(exchangeError || deleteError) && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {getErrorMessage(exchangeError || deleteError, 'Action failed')}
              </Alert>
            )}

            <Box
              sx={{
                mt: 'auto',
                pt: 2,
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              {!isAuthenticated ? (
                <Button
                  component={NextLink}
                  href="/login"
                  variant="contained"
                  startIcon={<SwapHorizIcon />}
                >
                  Sign in to Request Exchange
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SwapHorizIcon />}
                  disabled={isOwner || isRequesting}
                  onClick={handleExchange}
                >
                  {isOwner
                    ? 'You own this book'
                    : isRequesting
                      ? 'Sending request...'
                      : 'Request Exchange'}
                </Button>
              )}

              {canDelete && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlinedIcon />}
                  disabled={isDeleting}
                  onClick={(e) => {
                    e.currentTarget.blur();
                    setConfirmOpen(true);
                  }}
                >
                  Delete Book
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Book"
        description={`Are you sure you want to delete "${book.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </Box>
  );
}

export default function BookDetailsPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      }
    >
      <BookDetailsContent />
    </Suspense>
  );
}
