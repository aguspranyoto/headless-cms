import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(128),
  slug: z.string().min(1).max(160),
  description: z.string().max(512).optional(),
  parentId: z.string().uuid().optional(),
  sortOrder: z.number().int().optional().default(0),
});

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
