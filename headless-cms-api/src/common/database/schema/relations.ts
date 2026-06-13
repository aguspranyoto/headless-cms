import { relations } from 'drizzle-orm';
import { users } from './users.schema';
import { posts } from './posts.schema';
import { categories } from './categories.schema';

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
}));
