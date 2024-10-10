import { eq } from "drizzle-orm";

import db from "@/db";
import { channel, video, watchedVideo } from "@/db/schema";

export default class WatchedVideoRepository {
  async create(videos: (typeof watchedVideo.$inferInsert)[]) {
    return await db.insert(watchedVideo).values(videos).returning();
  }

  async getAll(userId: string) {
    return await db
      .select({
        youtubeId: watchedVideo.youtubeVideoId,
        title: video.title,
        url: video.url,
        time: watchedVideo.youtubeCreatedAt,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        youtubeCreatedAt: video.youtubeCreatedAt,
        channelId: video.channelId,
        channelName: channel.name,
        channelUrl: channel.url,
        channelAvatarUrl: channel.avatarUrl,
      })
      .from(watchedVideo)
      .where(eq(watchedVideo.userId, userId))
      .innerJoin(video, eq(watchedVideo.youtubeVideoId, video.youtubeId))
      .innerJoin(channel, eq(channel.youtubeId, video.channelId));
  }
}
