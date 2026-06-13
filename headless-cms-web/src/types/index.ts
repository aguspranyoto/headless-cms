export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  authorId: string;
  categoryId: string | null;
  createdAt: string;
  publishedAt: string | null;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  technologies: string | null;
  published: boolean;
  authorId: string;
  categoryId: string | null;
  createdAt: string;
  publishedAt: string | null;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  desc: string | null;
  icon: string | null;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  year: string;
  role: string;
  company: string;
  desc: string | null;
  stacks: string[] | null;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}
