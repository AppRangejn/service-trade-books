import { CreateUserPayload, UpdateUserPayload, User } from '@/types';
import { baseApi } from './baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<{ users: User[] }, void>({
      query: () => '/admin/users',
      providesTags: ['Users'],
    }),
    createUser: builder.mutation<{ user: User }, CreateUserPayload>({
      query: (body) => ({
        url: '/admin/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation<
      { user: User },
      { id: number; data: UpdateUserPayload }
    >({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Users', 'Me'],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', { type: 'Books', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = adminApi;
