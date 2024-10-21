import { and, count, desc, eq, max } from "drizzle-orm";

import db from "@/db";
import { channel, video, watchedVideo } from "@/db/schema";
import { insertWatchedVideo } from "@/types";

export default class WatchedVideoRepository {
  async create(videos: insertWatchedVideo[]) {
    return await db.insert(watchedVideo).values(videos).returning();
  }

  async getAll(userId: string) {
    const subquery = db
      .select({
        youtubeId: watchedVideo.youtubeVideoId,
        watchCount: count(watchedVideo.youtubeVideoId).as("watchCount"),
        lastWatchedAt: max(watchedVideo.youtubeCreatedAt).as("lastWatchedAt"),
      })
      .from(watchedVideo)
      .where(eq(watchedVideo.userId, userId))
      .groupBy(watchedVideo.youtubeVideoId)
      .as("subquery");

    return await db
      .select({
        youtubeId: subquery.youtubeId,
        title: video.title,
        url: video.url,
        lastWatchedAt: subquery.lastWatchedAt,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        youtubeCreatedAt: video.youtubeCreatedAt,
        channelId: video.channelId,
        channelName: channel.name,
        channelUrl: channel.url,
        channelAvatarUrl: channel.avatarUrl,
        watchCount: subquery.watchCount,
      })
      .from(subquery)
      .innerJoin(video, eq(subquery.youtubeId, video.youtubeId))
      .innerJoin(channel, eq(channel.youtubeId, video.channelId))
      .orderBy(desc(subquery.lastWatchedAt));
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
