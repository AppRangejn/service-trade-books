'use client';

import { useDeleteUserMutation, useGetUsersQuery } from '@/api/adminApi';
import { AdminSidebar, AdminTab } from '@/components/admin/AdminSidebar';
import { CreateUserForm } from '@/components/admin/CreateUserForm';
import { EditUserDialog } from '@/components/admin/EditUserDialog';
import { UsersTable } from '@/components/admin/UsersTable';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAppSelector } from '@/hooks/useRedux';
import { User } from '@/types';
import { getErrorMessage } from '@/utils/getErrorMessage';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export default function AdminUsersPage() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting, error: deleteError }] =
    useDeleteUserMutation();

  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id).unwrap();
      setToastMessage(`User "${userToDelete.name}" has been deleted`);
      setUserToDelete(null);
    } catch {
      // Handled deleteError
    }
  };

  const users = data?.users ?? [];

  return (
    <ProtectedRoute requireAdmin>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2.5, md: 3.5 },
          alignItems: 'flex-start',
        }}
      >
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          usersCount={users.length}
        />

        <Box sx={{ flexGrow: 1, width: '100%' }}>
          {activeTab === 'users' ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleOutlinedIcon color="primary" />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    User Management
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={() => setActiveTab('create')}
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  New User
                </Button>
              </Box>

              {(error || deleteError) && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {getErrorMessage(error || deleteError, 'Operation failed')}
                </Alert>
              )}

              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <UsersTable
                  users={users}
                  currentUserId={currentUser?.id}
                  isDeleting={isDeleting}
                  onEdit={setEditingUser}
                  onDelete={setUserToDelete}
                />
              )}
            </>
          ) : (
            <CreateUserForm
              onSuccess={(name) => {
                setToastMessage(`User "${name}" created successfully`);
                setActiveTab('users');
              }}
            />
          )}
        </Box>
      </Box>

      <EditUserDialog
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSuccess={(name) => setToastMessage(`User "${name}" updated`)}
      />

      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="Delete User"
        description={
          userToDelete
            ? `Are you sure you want to delete "${userToDelete.name}" (${userToDelete.email}) and all their books? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete User"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setUserToDelete(null)}
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
