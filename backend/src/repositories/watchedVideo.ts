import db from "@/db";
import { watchedVideo } from "@/db/schema";
import { insertWatchedVideo } from "@/types";
import { desc, eq } from "drizzle-orm";

export default class WatchedVideoRepository {
  async create(videos: insertWatchedVideo[]) {
    return await db.insert(watchedVideo).values(videos).returning();
  }

  async getMostRecentVideo(userId: string) {
    const [result] = await db
      .select({
        videoId: watchedVideo.youtubeVideoId,
        watchedAt: watchedVideo.youtubeCreatedAt,
      })
      .from(watchedVideo)
      .where(eq(watchedVideo.userId, userId))
      .orderBy(desc(watchedVideo.youtubeCreatedAt))
      .limit(1);

    return result;
  }
}
