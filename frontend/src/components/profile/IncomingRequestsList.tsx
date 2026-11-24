'use client';

import {
  useGetIncomingRequestsQuery,
  useUpdateRequestStatusMutation,
} from '@/api/profileApi';
import { EXCHANGE_STATUS } from '@/constants';
import { getErrorMessage } from '@/utils/getErrorMessage';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface IncomingRequestsListProps {
  userEmail: string;
  booksCount: number;
  onSuccess: (message: string) => void;
}

export function IncomingRequestsList({
  userEmail,
  booksCount,
  onSuccess,
}: IncomingRequestsListProps) {
  const { data, isLoading, error } = useGetIncomingRequestsQuery();
  const [updateStatus, { isLoading: isUpdating, error: statusError }] =
    useUpdateRequestStatusMutation();

  const requests = data?.requests ?? [];

  const handleStatusChange = async (
    id: number,
    status: typeof EXCHANGE_STATUS.ACCEPTED | typeof EXCHANGE_STATUS.REJECTED,
  ) => {
    try {
      await updateStatus({ id, status }).unwrap();
      onSuccess(
        status === EXCHANGE_STATUS.ACCEPTED
          ? 'Exchange request accepted'
          : 'Exchange request declined',
      );
    } catch {
      // Handled via statusError
    }
  };

  return (
    <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <MarkEmailReadOutlinedIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Incoming Exchange Requests
          </Typography>
        </Box>
        <Chip label={requests.length} size="small" color="primary" />
      </Box>

      {(error || statusError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {getErrorMessage(
            error || statusError,
            'Failed to process exchange requests',
          )}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : requests.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {requests.map((reqItem) => (
            <Box
              key={reqItem.id}
              sx={{
                p: 2,
                borderRadius: 2.5,
                bgcolor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 1,
                  mb: 1,
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {reqItem.requester.name} wants &ldquo;{reqItem.book.name}
                    &rdquo;
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Contact: {reqItem.requester.email}
                  </Typography>
                </Box>
                <Chip
                  label={reqItem.status.toUpperCase()}
                  size="small"
                  color={
                    reqItem.status === EXCHANGE_STATUS.ACCEPTED
                      ? 'success'
                      : reqItem.status === EXCHANGE_STATUS.REJECTED
                        ? 'error'
                        : 'warning'
                  }
                />
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5 }}
              >
                Offered books:{' '}
                {reqItem.requester.books.length > 0
                  ? reqItem.requester.books
                      .map((b) => `${b.name} (${b.author})`)
                      .join(', ')
                  : 'No books listed yet'}
              </Typography>

              {reqItem.status === EXCHANGE_STATUS.PENDING && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    disabled={isUpdating}
                    onClick={() =>
                      handleStatusChange(reqItem.id, EXCHANGE_STATUS.ACCEPTED)
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    disabled={isUpdating}
                    onClick={() =>
                      handleStatusChange(reqItem.id, EXCHANGE_STATUS.REJECTED)
                    }
                  >
                    Decline
                  </Button>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No exchange requests yet. Whenever another reader requests one of your{' '}
          {booksCount} listed {booksCount === 1 ? 'book' : 'books'}, their
          request and contact details will appear here alongside email delivery
          to <strong>{userEmail}</strong>.
        </Typography>
      )}
    </Paper>
  );
}
