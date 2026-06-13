import { CreateExperienceSchema } from './create-experience.dto';
import { z } from 'zod';

export const UpdateExperienceSchema = CreateExperienceSchema.partial();
export type UpdateExperienceDto = z.infer<typeof UpdateExperienceSchema>;
