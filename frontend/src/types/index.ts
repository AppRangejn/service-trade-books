import { SortOrder, UserRole } from '@/constants';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookOwner {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  name: string;
  author: string;
  photo: string | null;
  userId: number;
  owner?: BookOwner;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BooksListResponse {
  books: Book[];
  pagination: PaginationMeta;
}

export interface GetBooksParams {
  search?: string;
  sort?: SortOrder;
  page?: number;
  limit?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface CreateBookPayload {
  name: string;
  author: string;
  photo?: string;
}

export interface ExchangeResponse {
  message: string;
  previewUrl?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface ProfileResponse {
  user: User;
  booksCount: number;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  avatar?: string | null;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  previewUrl?: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface UpdateBookPayload {
  name?: string;
  author?: string;
  photo?: string | null;
}
