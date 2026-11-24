import * as yup from 'yup';
import { PAGINATION, SORT_ORDER_VALUES } from '../constants';

const emptyStringToUndefined = (value: unknown, originalValue: unknown) =>
  originalValue === '' ? undefined : value;

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
      .transform((value) => (value === '' ? null : value))
      .url('Photo must be a valid URL')
      .nullable()
      .optional(),
  }),
});

export const getBooksQuerySchema = yup.object({
  query: yup.object({
    search: yup.string().trim().optional(),
    sort: yup
      .string()
      .transform(emptyStringToUndefined)
      .oneOf(SORT_ORDER_VALUES, 'Sort must be ASC or DESC')
      .optional(),
    page: yup
      .number()
      .transform(emptyStringToUndefined)
      .integer()
      .min(1)
      .optional(),
    limit: yup
      .number()
      .transform(emptyStringToUndefined)
      .integer()
      .min(1)
      .max(PAGINATION.MAX_LIMIT)
      .optional(),
  }),
});

export const bookIdParamSchema = yup.object({
  params: yup.object({
    id: yup.number().integer().positive('Invalid book ID').required(),
  }),
});
