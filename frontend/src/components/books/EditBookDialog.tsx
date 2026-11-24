'use client';

import { useUpdateBookMutation } from '@/api/booksApi';
import { Book } from '@/types';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { createBookSchema } from '@/validation/schemas';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';

interface EditBookDialogProps {
  book: Book | null;
  onClose: () => void;
  onSuccess: (title: string) => void;
}

export const EditBookDialog = ({
  book,
  onClose,
  onSuccess,
}: EditBookDialogProps) => {
  const [updateBook, { isLoading, error }] = useUpdateBookMutation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: book?.name || '',
      author: book?.author || '',
      photo: book?.photo || '',
    },
    validationSchema: createBookSchema,
    onSubmit: async (values) => {
      if (!book) return;
      try {
        const updatedTitle = values.name.trim();
        await updateBook({
          id: book.id,
          data: {
            name: updatedTitle,
            author: values.author.trim(),
            photo: values.photo.trim() || null,
          },
        }).unwrap();
        onSuccess(updatedTitle);
        onClose();
      } catch {
        // Handled via error
      }
    },
  });

  return (
    <Dialog
      open={Boolean(book)}
      onClose={isLoading ? undefined : onClose}
      disableRestoreFocus
      maxWidth="sm"
      fullWidth
    >
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Edit Book</DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pt: '12px !important',
          }}
        >
          {error && (
            <Alert severity="error">
              {getErrorMessage(error, 'Failed to update book')}
            </Alert>
          )}

          <TextField
            fullWidth
            size="small"
            name="name"
            label="Book Title"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            fullWidth
            size="small"
            name="author"
            label="Author"
            value={formik.values.author}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.author && Boolean(formik.errors.author)}
            helperText={formik.touched.author && formik.errors.author}
          />

          <TextField
            fullWidth
            size="small"
            name="photo"
            label="Cover Image URL (optional)"
            placeholder="https://example.com/cover.jpg"
            value={formik.values.photo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.photo && Boolean(formik.errors.photo)}
            helperText={formik.touched.photo && formik.errors.photo}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} disabled={isLoading}>
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
