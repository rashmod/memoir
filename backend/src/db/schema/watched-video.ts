import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { user, video } from "@/db/schema";

const watchedVideo = pgTable("watched_video", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => user.id)
    .notNull(),
  youtubeVideoId: varchar("youtube_video_id", { length: 11 })
    .references(() => video.youtubeId)
    .notNull(),
  youtubeCreatedAt: timestamp("youtube_created_at").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export default watchedVideo;
