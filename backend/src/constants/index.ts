export const USER_ROLES = {
  USER: 'User',
  ADMIN: 'Admin',
} as const;

export const USER_ROLE_VALUES = Object.values(USER_ROLES);

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
} as const;

export const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export const SORT_ORDER_VALUES = Object.values(SORT_ORDER);

export type SortOrder = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

export const AUTH_CONFIG = {
  SALT_ROUNDS: 10,
  JWT_EXPIRES_IN: '7d',
  JWT_ISSUER: 'book-trade-api',
  JWT_AUDIENCE: 'book-trade-client',
  JWT_TOKEN_TYPE: 'access',
} as const;
