import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, like, asc, desc, or, SQL } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from '../common/database/drizzle.provider';
import { users } from '../common/database/schema';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { QueryDto } from '../common/dto/query.dto';

type User = typeof users.$inferSelect;

const ALLOWED_SORT_FIELDS = new Set(['createdAt', 'updatedAt', 'email', 'username', 'displayName']);

import * as bcrypt from 'bcryptjs';

function sanitizeUser(user: User) {
  const { passwordHash, ...safe } = user;
  return safe;
}

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async create(dto: CreateUserDto) {
    const existing = await this.db
      .select()
      .from(users)
      .where(eq(users.email, dto.email))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('Email already exists');
    }

    const usernameCheck = await this.db
      .select()
      .from(users)
      .where(eq(users.username, dto.username))
      .limit(1);

    if (usernameCheck.length > 0) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const adminEmails = (process.env.ADMIN_EMAIL || '').split(',').map(e => e.trim());
    const isAutoAdmin = adminEmails.includes(dto.email);

    const [created] = await this.db
      .insert(users)
      .values({
        email: dto.email,
        username: dto.username,
        passwordHash: hashedPassword,
        displayName: dto.displayName ?? null,
        avatarUrl: dto.avatarUrl ?? null,
        isActive: dto.isActive ?? true,
        role: isAutoAdmin ? 'ADMIN' : 'USER',
      })
      .returning();

    return sanitizeUser(created);
  }

  async findAll(query: QueryDto) {
    const { page, limit, sortBy, sortOrder, search } = query;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (search) {
      conditions.push(
        like(users.email, `%${search}%`),
      );
    }

    const where = conditions.length > 0 ? or(...conditions) : undefined;

    const orderBy = sortBy && ALLOWED_SORT_FIELDS.has(sortBy)
      ? sortOrder === 'desc'
        ? desc((users as any)[sortBy])
        : asc((users as any)[sortBy])
      : desc(users.createdAt);

    const items = await this.db
      .select()
      .from(users)
      .where(where as any)
      .limit(limit)
      .offset(offset)
      .orderBy(orderBy);

    const countResult = await this.db
      .select({ count: users.id })
      .from(users)
      .where(where as any);

    const total = countResult.length;

    return {
      data: items.map(sanitizeUser),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return sanitizeUser(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [updated] = await this.db
      .update(users)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return sanitizeUser(updated);
  }

  async remove(id: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.db.delete(users).where(eq(users.id, id));

    return { deleted: true };
  }
}
