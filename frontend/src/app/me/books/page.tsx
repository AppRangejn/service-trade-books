'use client';

import { useDeleteBookMutation, useGetMyBooksQuery } from '@/api/booksApi';
import { BookCard } from '@/components/BookCard';
import { AddBookForm } from '@/components/books/AddBookForm';
import { EditBookDialog } from '@/components/books/EditBookDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Book } from '@/types';
import { getErrorMessage } from '@/utils/getErrorMessage';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export default function MyBooksPage() {
  const { data, isLoading, error } = useGetMyBooksQuery();
  const [deleteBook, { isLoading: isDeleting, error: deleteError }] =
    useDeleteBookMutation();

  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    try {
      await deleteBook(bookToDelete.id).unwrap();
      setToastMessage(`"${bookToDelete.name}" removed from your collection`);
      setBookToDelete(null);
    } catch {
      // Handled deleteError
    }
  };

  return (
    <ProtectedRoute>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        My Books
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage books you offer for exchange with other members
      </Typography>

      <AddBookForm
        onSuccess={(title) =>
          setToastMessage(`"${title}" added to your collection`)
        }
      />

      {(error || deleteError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {getErrorMessage(error || deleteError, 'Failed to load your books')}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : data && data.books.length > 0 ? (
        <Grid container spacing={3}>
          {data.books.map((book) => (
            <Grid key={book.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <BookCard
                  book={book}
                  canDelete
                  onDelete={setBookToDelete}
                  isDeleting={isDeleting}
                />
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditOutlinedIcon fontSize="small" />}
                  onClick={(e) => {
                    e.currentTarget.blur();
                    setBookToEdit(book);
                  }}
                >
                  Edit Book
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            You haven&apos;t added any books yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Use the form above to add your first book for exchange.
          </Typography>
        </Paper>
      )}

      <EditBookDialog
        book={bookToEdit}
        onClose={() => setBookToEdit(null)}
        onSuccess={(title) => setToastMessage(`"${title}" updated`)}
      />

      <ConfirmDialog
        open={Boolean(bookToDelete)}
        title="Remove Book"
        description={
          bookToDelete
            ? `Are you sure you want to remove "${bookToDelete.name}" from your collection?`
            : ''
        }
        confirmLabel="Remove"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setBookToDelete(null)}
      />

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
    </ProtectedRoute>
  );
}
