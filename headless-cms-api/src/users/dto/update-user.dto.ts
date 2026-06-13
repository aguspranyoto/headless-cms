import { z } from 'zod';

export const UpdateUserSchema = z.object({
  email: z.string().email().max(255).optional(),
  username: z.string().min(3).max(64).optional(),
  displayName: z.string().max(128).optional(),
  avatarUrl: z.string().url().max(512).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
