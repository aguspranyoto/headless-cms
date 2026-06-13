import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, asc, desc } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from '../common/database/drizzle.provider';
import { categories, posts } from '../common/database/schema';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';
import type { QueryDto } from '../common/dto/query.dto';

const ALLOWED_SORT_FIELDS = new Set(['name', 'slug', 'sortOrder', 'createdAt', 'updatedAt']);

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const slugCheck = await this.db
      .select()
      .from(categories)
      .where(eq(categories.slug, dto.slug))
      .limit(1);

    if (slugCheck.length > 0) {
      throw new ConflictException('Slug already exists');
    }

    if (dto.parentId) {
      const parent = await this.db
        .select()
        .from(categories)
        .where(eq(categories.id, dto.parentId))
        .limit(1);

      if (parent.length === 0) {
        throw new NotFoundException('Parent category not found');
      }
    }

    const [created] = await this.db
      .insert(categories)
      .values({
        name: dto.name,
        slug: dto.slug,
        description: dto.description ?? null,
        parentId: dto.parentId ?? null,
        sortOrder: dto.sortOrder ?? 0,
      })
      .returning();

    return created;
  }

  async findAll(query: QueryDto) {
    const { page, limit, sortBy, sortOrder } = query;
    const offset = (page - 1) * limit;

    const orderBy = sortBy && ALLOWED_SORT_FIELDS.has(sortBy)
      ? sortOrder === 'desc'
        ? desc((categories as any)[sortBy])
        : asc((categories as any)[sortBy])
      : asc(categories.sortOrder);

    const items = await this.db
      .select()
      .from(categories)
      .limit(limit)
      .offset(offset)
      .orderBy(orderBy);

    const countResult = await this.db
      .select({ count: categories.id })
      .from(categories);

    const total = countResult.length;

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findAllTree() {
    const all = await this.db
      .select()
      .from(categories)
      .orderBy(asc(categories.sortOrder));

    const map = new Map<string, typeof all[0] & { children: any[] }>();
    const roots: (typeof all[0] & { children: any[] })[] = [];

    for (const cat of all) {
      map.set(cat.id, { ...cat, children: [] });
    }

    for (const cat of all) {
      const node = map.get(cat.id)!;
      if (cat.parentId && map.has(cat.parentId)) {
        map.get(cat.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  async findOne(id: string) {
    const [cat] = await this.db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (!cat) {
      throw new NotFoundException('Category not found');
    }

    return cat;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);

    if (dto.parentId) {
      const parent = await this.db
        .select()
        .from(categories)
        .where(eq(categories.id, dto.parentId))
        .limit(1);

      if (parent.length === 0) {
        throw new NotFoundException('Parent category not found');
      }
    }

    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.slug !== undefined) updateData.slug = dto.slug;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.parentId !== undefined) updateData.parentId = dto.parentId;
    if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;

    const [updated] = await this.db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.db
      .update(categories)
      .set({ parentId: null, updatedAt: new Date() })
      .where(eq(categories.parentId, id));

    await this.db
      .update(posts)
      .set({ categoryId: null })
      .where(eq(posts.categoryId, id));

    await this.db.delete(categories).where(eq(categories.id, id));

    return { deleted: true };
  }
}
