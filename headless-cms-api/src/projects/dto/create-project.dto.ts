import { z } from 'zod';

export const CreateProjectSchema = z.object({
  title: z.string().min(1).max(512),
  slug: z.string().min(1).max(600),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  coverImage: z.string().max(1024).optional(),
  githubUrl: z.string().max(1024).optional(),
  demoUrl: z.string().max(1024).optional(),
  technologies: z.string().max(1024).optional(),
  published: z.boolean().optional().default(false),
  authorId: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
});

export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;
