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

export const updateProfileSchema = yup.object({
  body: yup.object({
    name: yup
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100)
      .optional(),
    email: yup
      .string()
      .trim()
      .email('Invalid email format')
      .optional(),
    avatar: yup
      .string()
      .trim()
      .url('Avatar must be a valid URL')
      .max(500, 'Avatar URL must be at most 500 characters')
      .nullable()
      .optional(),
  }),
});

export const forgotPasswordSchema = yup.object({
  body: yup.object({
    email: yup
      .string()
      .trim()
      .email('Invalid email format')
      .required('Email is required'),
  }),
});

export const resetPasswordSchema = yup.object({
  body: yup.object({
    token: yup.string().trim().required('Reset token is required'),
    newPassword: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100)
      .required('New password is required'),
  }),
});
