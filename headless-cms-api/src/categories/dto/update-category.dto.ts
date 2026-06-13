import { z } from 'zod';

export const UpdateCategorySchema = z.object({
  name: z.string().min(1).max(128).optional(),
  slug: z.string().min(1).max(160).optional(),
  description: z.string().max(512).optional(),
  parentId: z.string().uuid().nullable().optional(),
  sortOrder: z.number().int().optional(),
});

export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
