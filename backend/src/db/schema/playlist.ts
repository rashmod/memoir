import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

const playlist = pgTable('playlist', {
	id: uuid('id').defaultRandom(),
	youtubeId: varchar('youtube_id', { length: 34 }).primaryKey().notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	youtubeCreatedAt: timestamp('youtube_created_at').notNull(),

	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export default playlist;
