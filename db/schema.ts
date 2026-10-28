import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const posts = sqliteTable('posts', { id: text('id').primaryKey(), author: text('author').notNull(), owner: text('owner').notNull(), body: text('body').notNull(), category: text('category').notNull(), photo: text('photo'), created: integer('created').notNull() });
export const comments = sqliteTable('comments', { id: text('id').primaryKey(), post: text('post').notNull(), author: text('author').notNull(), body: text('body').notNull(), created: integer('created').notNull() });
export const hearts = sqliteTable('hearts', { id: text('id').primaryKey(), post: text('post').notNull(), owner: text('owner').notNull() });
