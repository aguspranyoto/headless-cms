import { pgTable, uuid, varchar, timestamp, integer } from 'drizzle-orm/pg-core';

export const categories = pgTable('headless_cms_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 128 }).notNull().unique(),
  slug: varchar('slug', { length: 160 }).notNull().unique(),
  description: varchar('description', { length: 512 }),
  parentId: uuid('parent_id'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
