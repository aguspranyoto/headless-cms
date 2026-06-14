import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, like, desc, asc, or, SQL, count } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from '../common/database/drizzle.provider';
import { posts } from '../common/database/schema';
import type { CreatePostDto } from './dto/create-post.dto';
import type { UpdatePostDto } from './dto/update-post.dto';
import type { QueryDto } from '../common/dto/query.dto';

const ALLOWED_SORT_FIELDS = new Set(['title', 'createdAt', 'updatedAt', 'publishedAt', 'published']);

@Injectable()
export class PostsService {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async create(dto: CreatePostDto) {
    const slugCheck = await this.db
      .select()
      .from(posts)
      .where(eq(posts.slug, dto.slug))
      .limit(1);

    if (slugCheck.length > 0) {
      throw new ConflictException('Slug already exists');
    }

    const [created] = await this.db
      .insert(posts)
      .values({
        title: dto.title,
        slug: dto.slug,
        excerpt: dto.excerpt ?? null,
        content: dto.content,
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
        like(posts.title, `%${search}%`),
      );
    }

    const where = conditions.length > 0 ? or(...conditions) : undefined;

    const orderBy = sortBy && ALLOWED_SORT_FIELDS.has(sortBy)
      ? sortOrder === 'desc'
        ? desc((posts as any)[sortBy])
        : asc((posts as any)[sortBy])
      : desc(posts.createdAt);

    const items = await this.db
      .select()
      .from(posts)
      .where(where as any)
      .limit(limit)
      .offset(offset)
      .orderBy(orderBy);

    const [{ total }] = await this.db
      .select({ total: count() })
      .from(posts)
      .where(where as any);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const [post] = await this.db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: string, dto: UpdatePostDto) {
    await this.findOne(id);

    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.slug !== undefined) updateData.slug = dto.slug;
    if (dto.excerpt !== undefined) updateData.excerpt = dto.excerpt;
    if (dto.content !== undefined) updateData.content = dto.content;
    if (dto.published !== undefined) {
      updateData.published = dto.published;
      updateData.publishedAt = dto.published ? new Date() : null;
    }
    if (dto.categoryId !== undefined) updateData.categoryId = dto.categoryId;

    const [updated] = await this.db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning();

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.db.delete(posts).where(eq(posts.id, id));

    return { deleted: true };
  }
}
