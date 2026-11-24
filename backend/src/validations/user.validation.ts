import * as yup from 'yup';
import { USER_ROLE_VALUES } from '../constants';

export const createUserByAdminSchema = yup.object({
  body: yup.object({
    name: yup.string().trim().min(2).max(100).required('Name is required'),
    email: yup
      .string()
      .trim()
      .email('Invalid email format')
      .required('Email is required'),
    password: yup.string().min(6).max(100).required('Password is required'),
    role: yup.string().oneOf(USER_ROLE_VALUES, 'Invalid role').optional(),
  }),
});

export const updateUserByAdminSchema = yup.object({
  params: yup.object({
    id: yup.number().integer().positive('Invalid user ID').required(),
  }),
  body: yup.object({
    name: yup.string().trim().min(2).max(100).optional(),
    email: yup.string().trim().email('Invalid email format').optional(),
    password: yup.string().min(6).max(100).optional(),
    role: yup.string().oneOf(USER_ROLE_VALUES, 'Invalid role').optional(),
  }),
});

export const userIdParamSchema = yup.object({
  params: yup.object({
    id: yup.number().integer().positive('Invalid user ID').required(),
  }),
});
