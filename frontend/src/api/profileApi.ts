import { AuthResponse, ProfileResponse, UpdateProfilePayload } from '@/types';
import { baseApi } from './baseApi';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => '/profile',
      providesTags: ['Me', 'MyBooks'],
    }),
    updateProfile: builder.mutation<AuthResponse, UpdateProfilePayload>({
      query: (body) => ({
        url: '/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Me', 'Users'],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
