import { pgTable, uuid, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { categories } from './categories.schema';

export const posts = pgTable('headless_cms_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 512 }).notNull(),
  slug: varchar('slug', { length: 600 }).notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  published: boolean('published').default(false).notNull(),
  authorId: uuid('author_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  categoryId: uuid('category_id')
    .references(() => categories.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
