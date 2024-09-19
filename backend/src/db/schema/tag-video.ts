import {
	pgTable,
	primaryKey,
	timestamp,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';

import tag from '@/db/schema/tag';
import user from '@/db/schema/user';
import video from '@/db/schema/video';

const tagVideo = pgTable(
	'tag_video',
	{
		tagId: uuid('tag_id')
			.references(() => tag.id)
			.notNull(),
		youtubeVideoId: varchar('youtube_video_id', { length: 11 })
			.references(() => video.youtubeId)
			.notNull(),
		userId: uuid('user_id')
			.references(() => user.id)
			.notNull(),

		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
	},
	(table) => {
		return {
			pk: primaryKey({
				columns: [table.tagId, table.youtubeVideoId, table.userId],
			}),
		};
	}
);

export default tagVideo;
