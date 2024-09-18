import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

const channel = pgTable('channel', {
	id: varchar('id', { length: 11 }).primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	avatarUrl: varchar('avatar_url', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').notNull(),

	addedAt: timestamp('added_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export default channel;
