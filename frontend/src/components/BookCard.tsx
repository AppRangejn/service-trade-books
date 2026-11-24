'use client';

import { Book } from '@/types';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useState } from 'react';

interface BookCardProps {
  book: Book;
  canDelete?: boolean;
  onDelete?: (book: Book) => void;
  isDeleting?: boolean;
}

export const BookCard = ({
  book,
  canDelete = false,
  onDelete,
  isDeleting = false,
}: BookCardProps) => {
  const [imgError, setImgError] = useState(false);

  const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    event.currentTarget.blur();
    onDelete?.(book);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
    >
      {book.photo && !imgError ? (
        <CardMedia
          component="img"
          image={book.photo}
          alt={book.name}
          onError={() => setImgError(true)}
          sx={{
            width: '100%',
            aspectRatio: '3 / 4',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
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
            gap: 1,
          }}
        >
          <MenuBookIcon sx={{ fontSize: 44, opacity: 0.6 }} />
          <Typography variant="caption">No cover image</Typography>
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          noWrap
          title={book.name}
          sx={{ fontSize: '1.05rem', fontWeight: 700 }}
        >
          {book.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          Author: {book.author}
        </Typography>
        {book.owner && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 1 }}
          >
            Owner: {book.owner.name}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          component={Link}
          href={`/books/${book.id}`}
          size="small"
          variant="outlined"
        >
          Details
        </Button>

        {canDelete && onDelete && (
          <Tooltip title="Delete book">
            <span>
              <IconButton
                size="small"
                color="error"
                disabled={isDeleting}
                onClick={handleDeleteClick}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
};
