'use client';

import { USER_ROLES } from '@/constants';
import { User } from '@/types';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

interface UsersTableProps {
  users: User[];
  currentUserId?: number;
  isDeleting: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UsersTable = ({
  users,
  currentUserId,
  isDeleting,
  onEdit,
  onDelete,
}: UsersTableProps) => {
  const handleEditClick = (
    event: React.MouseEvent<HTMLElement>,
    user: User,
  ) => {
    event.currentTarget.blur();
    onEdit(user);
  };

  const handleDeleteClick = (
    event: React.MouseEvent<HTMLElement>,
    user: User,
  ) => {
    event.currentTarget.blur();
    onDelete(user);
  };

  return (
    <>
      <Stack spacing={2} sx={{ display: { xs: 'flex', sm: 'none' } }}>
        {users.map((u) => {
          const isSelf = currentUserId === u.id;

          return (
            <Paper key={u.id} sx={{ p: 2, borderRadius: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 1,
                  mb: 1,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700 }}
                      noWrap
                    >
                      {u.name}
                    </Typography>
                    {isSelf && (
                      <Chip label="You" size="small" variant="outlined" />
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ wordBreak: 'break-all' }}
                  >
                    {u.email}
                  </Typography>
                </Box>

                <Chip
                  label={u.role}
                  size="small"
                  color={u.role === USER_ROLES.ADMIN ? 'secondary' : 'default'}
                />
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  ID: #{u.id}
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon fontSize="small" />}
                    onClick={(e) => handleEditClick(e, u)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutlinedIcon fontSize="small" />}
                    disabled={isSelf || isDeleting}
                    onClick={(e) => handleDeleteClick(e, u)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Box>
            </Paper>
          );
        })}
      </Stack>

      <TableContainer
        component={Paper}
        sx={{ display: { xs: 'none', sm: 'block' }, borderRadius: 3 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => {
              const isSelf = currentUserId === u.id;

              return (
                <TableRow key={u.id} hover>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>
                    {u.name}{' '}
                    {isSelf && (
                      <Chip
                        label="You"
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.role}
                      size="small"
                      color={
                        u.role === USER_ROLES.ADMIN ? 'secondary' : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit user">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => handleEditClick(e, u)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip
                      title={
                        isSelf
                          ? 'You cannot delete your own account'
                          : 'Delete user'
                      }
                    >
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          disabled={isSelf || isDeleting}
                          onClick={(e) => handleDeleteClick(e, u)}
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
