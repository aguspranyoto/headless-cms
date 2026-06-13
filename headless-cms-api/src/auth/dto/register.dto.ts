import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  displayName: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
