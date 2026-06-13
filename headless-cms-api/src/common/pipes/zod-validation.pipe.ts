import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import type { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const messages = (result.error as ZodError).issues.map(
        (e) => `${e.path.join('.')}: ${e.message}`,
      );
      throw new BadRequestException(messages.join('; '));
    }
    return result.data;
  }
}
