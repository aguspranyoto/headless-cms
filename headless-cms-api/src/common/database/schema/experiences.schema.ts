import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const experiences = pgTable('headless_cms_experiences', {
  id: uuid('id').defaultRandom().primaryKey(),
  year: varchar('year', { length: 255 }).notNull(),
  role: varchar('role', { length: 512 }).notNull(),
  company: varchar('company', { length: 512 }).notNull(),
  desc: text('desc'),
  stacks: jsonb('stacks').$type<string[]>(), // Array of strings
  published: boolean('published').default(false).notNull(),
  authorId: uuid('author_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
