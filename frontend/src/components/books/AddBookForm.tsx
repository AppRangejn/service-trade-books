'use client';

import { useCreateBookMutation } from '@/api/booksApi';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { createBookSchema } from '@/validation/schemas';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';

interface AddBookFormProps {
  onSuccess?: (bookTitle: string) => void;
}

export const AddBookForm = ({ onSuccess }: AddBookFormProps) => {
  const [createBook, { isLoading, error }] = useCreateBookMutation();

  const formik = useFormik({
    initialValues: {
      name: '',
      author: '',
      photo: '',
    },
    validationSchema: createBookSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const title = values.name.trim();
        await createBook({
          name: title,
          author: values.author.trim(),
          photo: values.photo.trim() || undefined,
        }).unwrap();
        resetForm();
        onSuccess?.(title);
      } catch {
        // Handled error state
      }
    },
  });

  return (
    <Paper sx={{ p: 3, mb: 5 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Add a New Book
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {getErrorMessage(error, 'Failed to add book')}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        noValidate
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr auto' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        <TextField
          size="small"
          id="name"
          name="name"
          label="Book Title *"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />

        <TextField
          size="small"
          id="author"
          name="author"
          label="Author *"
          value={formik.values.author}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.author && Boolean(formik.errors.author)}
          helperText={formik.touched.author && formik.errors.author}
        />

        <TextField
          size="small"
          id="photo"
          name="photo"
          label="Cover Image URL (optional)"
          placeholder="https://..."
          value={formik.values.photo}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.photo && Boolean(formik.errors.photo)}
          helperText={formik.touched.photo && formik.errors.photo}
        />

        <Button
          type="submit"
          variant="contained"
          startIcon={<AddIcon />}
          disabled={isLoading}
          sx={{ height: 40 }}
        >
          {isLoading ? 'Adding...' : 'Add Book'}
        </Button>
      </Box>
    </Paper>
  );
};
