import { z } from 'zod';

export const CreatePostSchema = z.object({
  title: z.string().min(1).max(512),
  slug: z.string().min(1).max(600),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  published: z.boolean().optional().default(false),
  authorId: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
});

export type CreatePostDto = z.infer<typeof CreatePostSchema>;
