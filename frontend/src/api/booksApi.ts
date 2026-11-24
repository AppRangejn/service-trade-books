import {
  Book,
  BooksListResponse,
  CreateBookPayload,
  ExchangeResponse,
  GetBooksParams,
  UpdateBookPayload,
} from '@/types';
import { baseApi } from './baseApi';

export const booksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<BooksListResponse, GetBooksParams | void>({
      query: (params) => ({
        url: '/books',
        params: params || undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.books.map(({ id }) => ({ type: 'Books' as const, id })),
              { type: 'Books', id: 'LIST' },
            ]
          : [{ type: 'Books', id: 'LIST' }],
    }),
    getBookById: builder.query<{ book: Book }, number>({
      query: (id) => `/books/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Book', id }],
    }),
    getMyBooks: builder.query<{ books: Book[] }, void>({
      query: () => '/me/books',
      providesTags: ['MyBooks'],
    }),
    createBook: builder.mutation<{ book: Book }, CreateBookPayload>({
      query: (body) => ({
        url: '/me/books',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Books', id: 'LIST' }, 'MyBooks'],
    }),
    updateBook: builder.mutation<
      { book: Book },
      { id: number; data: UpdateBookPayload }
    >({
      query: ({ id, data }) => ({
        url: `/me/books/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Books', id },
        { type: 'Books', id: 'LIST' },
        { type: 'Book', id },
        'MyBooks',
      ],
    }),
    deleteBook: builder.mutation<void, number>({
      query: (id) => ({
        url: `/books/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Books', id },
        { type: 'Books', id: 'LIST' },
        { type: 'Book', id },
        'MyBooks',
      ],
    }),
    requestExchange: builder.mutation<ExchangeResponse, number>({
      query: (bookId) => ({
        url: `/books/${bookId}/exchange`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useGetMyBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useRequestExchangeMutation,
} = booksApi;
