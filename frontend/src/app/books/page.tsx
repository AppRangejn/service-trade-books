'use client';

import { useDeleteBookMutation, useGetBooksQuery } from '@/api/booksApi';
import { BookCard } from '@/components/BookCard';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import {
  DEFAULT_PAGINATION,
  SORT_ORDER,
  SortOrder,
  USER_ROLES,
} from '@/constants';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppSelector } from '@/hooks/useRedux';
import { Book } from '@/types';
import { getErrorMessage } from '@/utils/getErrorMessage';
import SearchIcon from '@mui/icons-material/Search';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export default function BooksCatalogPage() {
  const [searchInput, setSearchInput] = useState('');
  const [sort, setSort] = useState<SortOrder>(SORT_ORDER.ASC);
  const [page, setPage] = useState<number>(DEFAULT_PAGINATION.PAGE);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchInput, 400);
  const { user } = useAppSelector((state) => state.auth);

  const { data, isLoading, isFetching, error } = useGetBooksQuery({
    search: debouncedSearch || undefined,
    sort,
    page,
    limit: DEFAULT_PAGINATION.LIMIT,
  });

  const [deleteBook, { isLoading: isDeleting, error: deleteError }] =
    useDeleteBookMutation();

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleSortChange = (value: SortOrder) => {
    setSort(value);
    setPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    try {
      await deleteBook(bookToDelete.id).unwrap();
      setToastMessage(`"${bookToDelete.name}" has been deleted`);
      setBookToDelete(null);
    } catch {
      // Handled deleteError
    }
  };

  const isAdmin = user?.role === USER_ROLES.ADMIN;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Books Catalog
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Browse available books and request an exchange with their owners
      </Typography>

      <Paper
        sx={{
          p: 2,
          mb: 4,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <TextField
          size="small"
          placeholder="Search by title or author..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 240 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <FormControl size="small" sx={{ minWidth: 190 }}>
          <InputLabel id="sort-select-label">Sort by title</InputLabel>
          <Select
            labelId="sort-select-label"
            value={sort}
            label="Sort by title"
            onChange={(e) => handleSortChange(e.target.value as SortOrder)}
          >
            <MenuItem value={SORT_ORDER.ASC}>Title: A → Z</MenuItem>
            <MenuItem value={SORT_ORDER.DESC}>Title: Z → A</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {(error || deleteError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {getErrorMessage(error || deleteError, 'Failed to load books')}
        </Alert>
      )}

      {isLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: DEFAULT_PAGINATION.LIMIT }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <Skeleton variant="rectangular" height={220} />
                <CardContent>
                  <Skeleton variant="text" height={28} width="80%" />
                  <Skeleton variant="text" height={20} width="60%" />
                  <Skeleton
                    variant="text"
                    height={18}
                    width="45%"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : data && data.books.length > 0 ? (
        <>
          <Grid
            container
            spacing={3}
            sx={{ opacity: isFetching ? 0.65 : 1, transition: 'opacity 0.2s' }}
          >
            {data.books.map((book) => {
              const canDelete = Boolean(
                user && (isAdmin || book.userId === user.id),
              );

              return (
                <Grid key={book.id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <BookCard
                    book={book}
                    canDelete={canDelete}
                    onDelete={setBookToDelete}
                    isDeleting={isDeleting}
                  />
                </Grid>
              );
            })}
          </Grid>

          {data.pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Pagination
                count={data.pagination.totalPages}
                page={page}
                onChange={(_e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      ) : (
        <Paper sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No books found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search query or check back later.
          </Typography>
        </Paper>
      )}

      <ConfirmDialog
        open={Boolean(bookToDelete)}
        title="Delete Book"
        description={
          bookToDelete
            ? `Are you sure you want to delete "${bookToDelete.name}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
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
    </Box>
  );
}
