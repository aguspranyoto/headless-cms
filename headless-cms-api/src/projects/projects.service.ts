import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, like, desc, asc, or, SQL } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from '../common/database/drizzle.provider';
import { projects } from '../common/database/schema';
import type { CreateProjectDto } from './dto/create-project.dto';
import type { UpdateProjectDto } from './dto/update-project.dto';
import type { QueryDto } from '../common/dto/query.dto';

const ALLOWED_SORT_FIELDS = new Set(['title', 'createdAt', 'updatedAt', 'publishedAt', 'published']);

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async create(dto: CreateProjectDto) {
    const slugCheck = await this.db
      .select()
      .from(projects)
      .where(eq(projects.slug, dto.slug))
      .limit(1);

    if (slugCheck.length > 0) {
      throw new ConflictException('Slug already exists');
    }

    const [created] = await this.db
      .insert(projects)
      .values({
        title: dto.title,
        slug: dto.slug,
        excerpt: dto.excerpt ?? null,
        content: dto.content,
        coverImage: dto.coverImage ?? null,
        githubUrl: dto.githubUrl ?? null,
        demoUrl: dto.demoUrl ?? null,
        technologies: dto.technologies ?? null,
        published: dto.published ?? false,
        authorId: dto.authorId,
        categoryId: dto.categoryId ?? null,
        publishedAt: dto.published ? new Date() : null,
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
        like(projects.title, `%${search}%`),
      );
    }

    const where = conditions.length > 0 ? or(...conditions) : undefined;

    const orderBy = sortBy && ALLOWED_SORT_FIELDS.has(sortBy)
      ? sortOrder === 'desc'
        ? desc((projects as any)[sortBy])
        : asc((projects as any)[sortBy])
      : desc(projects.createdAt);

    const items = await this.db
      .select()
      .from(projects)
      .where(where as any)
      .limit(limit)
      .offset(offset)
      .orderBy(orderBy);

    const countResult = await this.db
      .select({ count: projects.id })
      .from(projects)
      .where(where as any);

    const total = countResult.length;

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const [project] = await this.db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);

    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.slug !== undefined) updateData.slug = dto.slug;
    if (dto.excerpt !== undefined) updateData.excerpt = dto.excerpt;
    if (dto.content !== undefined) updateData.content = dto.content;
    if (dto.coverImage !== undefined) updateData.coverImage = dto.coverImage;
    if (dto.githubUrl !== undefined) updateData.githubUrl = dto.githubUrl;
    if (dto.demoUrl !== undefined) updateData.demoUrl = dto.demoUrl;
    if (dto.technologies !== undefined) updateData.technologies = dto.technologies;
    if (dto.published !== undefined) {
      updateData.published = dto.published;
      updateData.publishedAt = dto.published ? new Date() : null;
    }
    if (dto.categoryId !== undefined) updateData.categoryId = dto.categoryId;

    const [updated] = await this.db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning();

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.db.delete(projects).where(eq(projects.id, id));

    return { deleted: true };
  }
}
