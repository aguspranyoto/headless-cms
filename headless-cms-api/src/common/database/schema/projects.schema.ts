import { pgTable, uuid, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { categories } from './categories.schema';

export const projects = pgTable('headless_cms_projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 512 }).notNull(),
  slug: varchar('slug', { length: 600 }).notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  coverImage: varchar('cover_image', { length: 1024 }),
  githubUrl: varchar('github_url', { length: 1024 }),
  demoUrl: varchar('demo_url', { length: 1024 }),
  technologies: varchar('technologies', { length: 1024 }), // Can be comma separated
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
