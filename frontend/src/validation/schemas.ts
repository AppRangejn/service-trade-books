import { USER_ROLES } from '@/constants';
import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .required('Name is required'),
  email: yup
    .string()
    .trim()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long')
    .required('Password is required'),
});

export const createBookSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(1, 'Book title is required')
    .max(255, 'Book title is too long')
    .required('Book title is required'),
  author: yup
    .string()
    .trim()
    .min(1, 'Author name is required')
    .max(255, 'Author name is too long')
    .required('Author is required'),
  photo: yup
    .string()
    .trim()
    .url('Enter a valid image URL (http:// or https://)')
    .optional(),
});

export const createUserAdminSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .required('Name is required'),
  email: yup
    .string()
    .trim()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: yup
    .string()
    .oneOf([USER_ROLES.USER, USER_ROLES.ADMIN], 'Select a valid role')
    .required('Role is required'),
});

export const updateUserAdminSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .required('Name is required'),
  email: yup
    .string()
    .trim()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .test(
      'empty-or-min',
      'Password must be at least 6 characters',
      (val) => !val || val.length >= 6,
    )
    .optional(),
  role: yup
    .string()
    .oneOf([USER_ROLES.USER, USER_ROLES.ADMIN], 'Select a valid role')
    .required('Role is required'),
});
