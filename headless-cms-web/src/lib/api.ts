import axios from 'axios';
import Cookies from 'js-cookie';
import type { PaginatedResponse, User, Category, CategoryNode, Post } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (data: Record<string, string>) =>
    api.post('/auth/login', data).then((r) => r.data),
  register: (data: Record<string, string>) =>
    api.post('/auth/register', data).then((r) => r.data),
  verifyEmail: (token: string) =>
    api.get(`/auth/verify-email?token=${token}`).then((r) => r.data),
};

// Users
export const usersApi = {
  list: (params?: Record<string, string | number>) =>
    api.get<PaginatedResponse<User>>('/users', { params }).then((r) => r.data),
  get: (id: string) =>
    api.get<User>(`/users/${id}`).then((r) => r.data),
  create: (data: Record<string, unknown>) =>
    api.post<User>('/users', data).then((r) => r.data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch<User>(`/users/${id}`, data).then((r) => r.data),
  delete: (id: string) =>
    api.delete(`/users/${id}`).then((r) => r.data),
};

// Categories
export const categoriesApi = {
  list: (params?: Record<string, string | number>) =>
    api.get<PaginatedResponse<Category>>('/categories', { params }).then((r) => r.data),
  tree: () =>
    api.get<CategoryNode[]>('/categories/tree').then((r) => r.data),
  get: (id: string) =>
    api.get<Category>(`/categories/${id}`).then((r) => r.data),
  create: (data: Record<string, unknown>) =>
    api.post<Category>('/categories', data).then((r) => r.data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch<Category>(`/categories/${id}`, data).then((r) => r.data),
  delete: (id: string) =>
    api.delete(`/categories/${id}`).then((r) => r.data),
};

// Posts
export const postsApi = {
  list: (params?: Record<string, string | number>) =>
    api.get<PaginatedResponse<Post>>('/posts', { params }).then((r) => r.data),
  get: (id: string) =>
    api.get<Post>(`/posts/${id}`).then((r) => r.data),
  create: (data: Record<string, unknown>) =>
    api.post<Post>('/posts', data).then((r) => r.data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch<Post>(`/posts/${id}`, data).then((r) => r.data),
  delete: (id: string) =>
    api.delete(`/posts/${id}`).then((r) => r.data),
};
