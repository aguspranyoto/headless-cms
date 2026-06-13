import { z } from 'zod';

export const CreateServiceSchema = z.object({
  title: z.string().min(1).max(512),
  slug: z.string().min(1).max(600),
  desc: z.string().optional().nullable(),
  icon: z.string().max(255).optional().nullable(),
  published: z.boolean().optional().default(false),
  authorId: z.string().uuid(),
});

export type CreateServiceDto = z.infer<typeof CreateServiceSchema>;
