import { z } from 'zod';

export const CreateExperienceSchema = z.object({
  year: z.string().min(1).max(255),
  role: z.string().min(1).max(512),
  company: z.string().min(1).max(512),
  desc: z.string().optional().nullable(),
  stacks: z.array(z.string()).optional().nullable(),
  published: z.boolean().optional().default(false),
  authorId: z.string().uuid(),
});

export type CreateExperienceDto = z.infer<typeof CreateExperienceSchema>;
