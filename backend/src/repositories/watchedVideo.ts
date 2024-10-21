import { and, eq } from "drizzle-orm";

import db from "@/db";
import { watchedVideo } from "@/db/schema";
import { insertWatchedVideo } from "@/types";

export default class WatchedVideoRepository {
  async create(videos: insertWatchedVideo[]) {
    return await db.insert(watchedVideo).values(videos).returning();
  }

  async get(userId: string, videoId: string) {
    return await db
      .select()
      .from(watchedVideo)
      .where(
        and(
          eq(watchedVideo.userId, userId),
          eq(watchedVideo.youtubeVideoId, videoId),
        ),
      );
  }
}
