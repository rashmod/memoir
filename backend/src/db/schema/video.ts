import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

const video = pgTable('video', {
	id: varchar('id', { length: 11 }).primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	thumbnailUrl: varchar('thumbnail_url', { length: 255 }).notNull(),
	duration: integer('duration').notNull(),
	createdAt: timestamp('created_at').notNull(),

	addedAt: timestamp('added_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export default video;
