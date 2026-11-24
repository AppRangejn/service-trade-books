import * as yup from 'yup';

export const registerSchema = yup.object({
  body: yup.object({
    name: yup
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100)
      .required('Name is required'),
    email: yup
      .string()
      .trim()
      .email('Invalid email format')
      .required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100)
      .required('Password is required'),
  }),
});

export const loginSchema = yup.object({
  body: yup.object({
    email: yup
      .string()
      .trim()
      .email('Invalid email format')
      .required('Email is required'),
    password: yup.string().required('Password is required'),
  }),
});
