import { CreateServiceSchema } from './create-service.dto';
import { z } from 'zod';

export const UpdateServiceSchema = CreateServiceSchema.partial();
export type UpdateServiceDto = z.infer<typeof UpdateServiceSchema>;
