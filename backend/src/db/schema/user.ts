import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

const user = pgTable('user', {
	id: uuid('id').defaultRandom().primaryKey(),
	username: varchar('username', { length: 255 }).notNull(),

	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export default user;
