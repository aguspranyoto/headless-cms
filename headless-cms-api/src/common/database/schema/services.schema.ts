import { pgTable, uuid, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const services = pgTable('headless_cms_services', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 512 }).notNull(),
  slug: varchar('slug', { length: 600 }).notNull().unique(),
  desc: text('desc'),
  icon: varchar('icon', { length: 255 }), // lucide icon name
  published: boolean('published').default(false).notNull(),
  authorId: uuid('author_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
