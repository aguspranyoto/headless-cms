import { relations } from 'drizzle-orm';
import { users } from './users.schema';
import { posts } from './posts.schema';
import { categories } from './categories.schema';
import { projects } from './projects.schema';
import { services } from './services.schema';
import { experiences } from './experiences.schema';

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  projects: many(projects),
  services: many(services),
  experiences: many(experiences),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  posts: many(posts),
  projects: many(projects),
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

export const projectsRelations = relations(projects, ({ one }) => ({
  author: one(users, {
    fields: [projects.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [projects.categoryId],
    references: [categories.id],
  }),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  author: one(users, {
    fields: [services.authorId],
    references: [users.id],
  }),
}));

export const experiencesRelations = relations(experiences, ({ one }) => ({
  author: one(users, {
    fields: [experiences.authorId],
    references: [users.id],
  }),
}));
