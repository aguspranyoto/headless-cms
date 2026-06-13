import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  username: z.string().min(3).max(64),
  password: z.string().min(8).max(128),
  displayName: z.string().max(128).optional(),
  avatarUrl: z.string().url().max(512).optional(),
  isActive: z.boolean().optional().default(true),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
