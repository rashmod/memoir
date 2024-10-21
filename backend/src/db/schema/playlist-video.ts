import { pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";

import { playlist } from "@/db/schema";
import { video } from "@/db/schema";

const playlistVideo = pgTable(
  "playlist_video",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    youtubePlaylistId: varchar("youtube_playlist_id", { length: 34 })
      .references(() => playlist.youtubeId)
      .notNull(),
    youtubeVideoId: varchar("youtube_video_id", { length: 11 })
      .references(() => video.youtubeId)
      .notNull(),
    youtubeCreatedAt: timestamp("youtube_created_at").notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      playlistId_videoId: unique().on(
        table.youtubePlaylistId,
        table.youtubeVideoId,
      ),
    };
  },
);

export default playlistVideo;
