import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { channel } from "@/db/schema";

const video = pgTable("video", {
  id: uuid("id").defaultRandom().notNull(),
  youtubeId: varchar("youtube_id", { length: 11 }).primaryKey().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 255 }).notNull(),
  duration: integer("duration").notNull(),
  youtubeCreatedAt: timestamp("youtube_created_at").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),

  channelId: varchar("channel_id", { length: 24 })
    .references(() => channel.youtubeId)
    .notNull(),
});

// const likedVideo = pgTable('liked_video', {
// 	id: uuid('id').primaryKey().defaultRandom(),
// 	userId: uuid('user_id')
// 		.references(() => user.id)
// 		.notNull(),
// 	videoId: uuid('video_id')
// 		.references(() => video.id)
// 		.notNull(),
// 	addedAt: timestamp('added_at').notNull(),

// 	createdAt: timestamp('created_at').notNull().defaultNow(),
// 	updatedAt: timestamp('updated_at').notNull().defaultNow(),
// });

export default video;
