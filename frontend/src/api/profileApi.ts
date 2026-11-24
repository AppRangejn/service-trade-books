import { ExchangeStatus } from '@/constants';
import {
  AuthResponse,
  IncomingExchangeRequest,
  ProfileResponse,
  UpdateProfilePayload,
} from '@/types';
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
    getIncomingRequests: builder.query<
      { requests: IncomingExchangeRequest[] },
      void
    >({
      query: () => '/profile/requests',
      providesTags: ['ProfileRequests'],
    }),
    updateRequestStatus: builder.mutation<
      void,
      { id: number; status: Exclude<ExchangeStatus, 'pending'> }
    >({
      query: ({ id, status }) => ({
        url: `/profile/requests/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['ProfileRequests'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetIncomingRequestsQuery,
  useUpdateRequestStatusMutation,
} = profileApi;
