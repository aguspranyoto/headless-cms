import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, like, desc, asc, or, SQL } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from '../common/database/drizzle.provider';
import { services } from '../common/database/schema';
import type { CreateServiceDto } from './dto/create-service.dto';
import type { UpdateServiceDto } from './dto/update-service.dto';
import type { QueryDto } from '../common/dto/query.dto';

const ALLOWED_SORT_FIELDS = new Set(['title', 'createdAt', 'updatedAt', 'published']);

@Injectable()
export class ServicesService {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async create(dto: CreateServiceDto) {
    const slugCheck = await this.db
      .select()
      .from(services)
      .where(eq(services.slug, dto.slug))
      .limit(1);

    if (slugCheck.length > 0) {
      throw new ConflictException('Slug already exists');
    }

    const [created] = await this.db
      .insert(services)
      .values({
        title: dto.title,
        slug: dto.slug,
        desc: dto.desc ?? null,
        icon: dto.icon ?? null,
        published: dto.published ?? false,
        authorId: dto.authorId,
      })
      .returning();

    return created;
  }

  async findAll(query: QueryDto) {
    const { page, limit, sortBy, sortOrder, search } = query;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (search) {
      conditions.push(
        like(services.title, `%${search}%`),
      );
    }

    const where = conditions.length > 0 ? or(...conditions) : undefined;

    const orderBy = sortBy && ALLOWED_SORT_FIELDS.has(sortBy)
      ? sortOrder === 'desc'
        ? desc((services as any)[sortBy])
        : asc((services as any)[sortBy])
      : desc(services.createdAt);

    const items = await this.db
      .select()
      .from(services)
      .where(where as any)
      .limit(limit)
      .offset(offset)
      .orderBy(orderBy);

    const countResult = await this.db
      .select({ count: services.id })
      .from(services)
      .where(where as any);

    const total = countResult.length;

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const [service] = await this.db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id);

    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.slug !== undefined) updateData.slug = dto.slug;
    if (dto.desc !== undefined) updateData.desc = dto.desc;
    if (dto.icon !== undefined) updateData.icon = dto.icon;
    if (dto.published !== undefined) updateData.published = dto.published;

    const [updated] = await this.db
      .update(services)
      .set(updateData)
      .where(eq(services.id, id))
      .returning();

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.db.delete(services).where(eq(services.id, id));

    return { deleted: true };
  }
}
