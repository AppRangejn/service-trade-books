import { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types';
import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Me', 'MyBooks'],
    }),
    register: builder.mutation<AuthResponse, RegisterPayload>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Me', 'MyBooks'],
    }),
    getMe: builder.query<{ user: User }, void>({
      query: () => '/auth/me',
      providesTags: ['Me'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
