import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const posts = sqliteTable('posts', { id: text('id').primaryKey(), author: text('author').notNull(), owner: text('owner').notNull(), body: text('body').notNull(), category: text('category').notNull(), photo: text('photo'), created: integer('created').notNull() });
export const comments = sqliteTable('comments', { id: text('id').primaryKey(), post: text('post').notNull(), author: text('author').notNull(), body: text('body').notNull(), created: integer('created').notNull() });
export const hearts = sqliteTable('hearts', { id: text('id').primaryKey(), post: text('post').notNull(), owner: text('owner').notNull() });
export const events = sqliteTable('events', {
 id: text('id').primaryKey(), owner: text('owner').notNull(), title: text('title').notNull(),
 date: text('date').notNull(), endDate: text('end_date').notNull(), time: text('time').notNull(),
 endTime: text('end_time').notNull(), allDay: integer('all_day').notNull(), category: text('category').notNull(),
 location: text('location').notNull(), note: text('note').notNull(), author: text('author').notNull(),
 participants: text('participants').notNull().default('[]'), repeat: text('repeat').notNull().default('none'), created: integer('created').notNull(), updated: integer('updated').notNull(), deleted: integer('deleted').notNull().default(0),
});


