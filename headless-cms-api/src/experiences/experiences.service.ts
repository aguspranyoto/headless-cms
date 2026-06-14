import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, like, desc, asc, or, SQL, count } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from '../common/database/drizzle.provider';
import { experiences } from '../common/database/schema';
import type { CreateExperienceDto } from './dto/create-experience.dto';
import type { UpdateExperienceDto } from './dto/update-experience.dto';
import type { QueryDto } from '../common/dto/query.dto';

const ALLOWED_SORT_FIELDS = new Set(['role', 'company', 'year', 'createdAt', 'updatedAt', 'published']);

@Injectable()
export class ExperiencesService {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async create(dto: CreateExperienceDto) {
    const [created] = await this.db
      .insert(experiences)
      .values({
        year: dto.year,
        role: dto.role,
        company: dto.company,
        desc: dto.desc ?? null,
        stacks: dto.stacks ?? null,
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
        like(experiences.role, `%${search}%`),
        like(experiences.company, `%${search}%`)
      );
    }

    const where = conditions.length > 0 ? or(...conditions) : undefined;

    const orderBy = sortBy && ALLOWED_SORT_FIELDS.has(sortBy)
      ? sortOrder === 'desc'
        ? desc((experiences as any)[sortBy])
        : asc((experiences as any)[sortBy])
      : desc(experiences.createdAt);

    const items = await this.db
      .select()
      .from(experiences)
      .where(where as any)
      .limit(limit)
      .offset(offset)
      .orderBy(orderBy);

    const [{ total }] = await this.db
      .select({ total: count() })
      .from(experiences)
      .where(where as any);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const [experience] = await this.db
      .select()
      .from(experiences)
      .where(eq(experiences.id, id))
      .limit(1);

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    return experience;
  }

  async update(id: string, dto: UpdateExperienceDto) {
    await this.findOne(id);

    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (dto.year !== undefined) updateData.year = dto.year;
    if (dto.role !== undefined) updateData.role = dto.role;
    if (dto.company !== undefined) updateData.company = dto.company;
    if (dto.desc !== undefined) updateData.desc = dto.desc;
    if (dto.stacks !== undefined) updateData.stacks = dto.stacks;
    if (dto.published !== undefined) updateData.published = dto.published;

    const [updated] = await this.db
      .update(experiences)
      .set(updateData)
      .where(eq(experiences.id, id))
      .returning();

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.db.delete(experiences).where(eq(experiences.id, id));

    return { deleted: true };
  }
}
