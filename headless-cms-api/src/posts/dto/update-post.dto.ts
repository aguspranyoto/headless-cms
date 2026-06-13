import { z } from 'zod';

export const UpdatePostSchema = z.object({
  title: z.string().min(1).max(512).optional(),
  slug: z.string().min(1).max(600).optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1).optional(),
  published: z.boolean().optional(),
  categoryId: z.string().uuid().nullable().optional(),
});

export type UpdatePostDto = z.infer<typeof UpdatePostSchema>;
