import * as yup from 'yup';
import { SORT_ORDER_VALUES } from '../constants';

export const createBookSchema = yup.object({
  body: yup.object({
    name: yup
      .string()
      .trim()
      .min(1, 'Book name is required')
      .max(255)
      .required('Book name is required'),
    author: yup
      .string()
      .trim()
      .min(1, 'Author is required')
      .max(255)
      .required('Author is required'),
    photo: yup
      .string()
      .trim()
      .url('Photo must be a valid URL')
      .nullable()
      .optional()
      .transform((value) => (value === '' ? null : value)),
  }),
});

export const getBooksQuerySchema = yup.object({
  query: yup.object({
    search: yup.string().trim().optional(),
    sort: yup
      .string()
      .oneOf(SORT_ORDER_VALUES, 'Sort must be ASC or DESC')
      .optional(),
    page: yup.number().integer().min(1).optional(),
    limit: yup.number().integer().min(1).max(50).optional(),
  }),
});

export const bookIdParamSchema = yup.object({
  params: yup.object({
    id: yup.number().integer().positive('Invalid book ID').required(),
  }),
});
