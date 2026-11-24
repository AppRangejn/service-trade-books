export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const TOKEN_STORAGE_KEY = 'book_exchange_token';
export const USER_STORAGE_KEY = 'book_exchange_user';

export const AUTH_SLICE_NAME = 'auth';

export const USER_ROLES = {
  USER: 'User',
  ADMIN: 'Admin',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export type SortOrder = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 8,
} as const;

export const EXCHANGE_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const;

export const EXCHANGE_STATUS_VALUES = Object.values(EXCHANGE_STATUS);

export type ExchangeStatus =
  (typeof EXCHANGE_STATUS)[keyof typeof EXCHANGE_STATUS];
