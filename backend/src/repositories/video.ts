import { eq, inArray, sql } from "drizzle-orm";

import db from "@/db";
import { channel, video } from "@/db/schema";
import { insertVideo } from "@/types";

import formatExcludedColumns from "@/lib/format-excluded-columns";
import formatTableColumnName from "@/lib/format-table-column-name";

export default class VideoRepository {
  async create(videos: insertVideo[]) {
    return await db.insert(video).values(videos).returning();
  }

  async createOrUpdate(videos: insertVideo[]) {
    await db
      .insert(video)
      .values(videos)
      .onConflictDoUpdate({
        target: video.youtubeId,
        set: {
          title: sql.raw(formatExcludedColumns(video, "title")),
          thumbnailUrl: sql.raw(formatExcludedColumns(video, "thumbnailUrl")),
          updatedAt: sql.raw(
            `CASE 
                WHEN (
                    ${formatTableColumnName(video, "title")} <> ${formatExcludedColumns(video, "title")} 
                    AND 
                    ${formatTableColumnName(video, "thumbnailUrl")} <> ${formatExcludedColumns(video, "thumbnailUrl")}
                ) 
                THEN NOW() 
                ELSE ${formatTableColumnName(video, "updatedAt")} 
            END`,
          ),
        },
      });
  }

  async getExisting(ids: string[]) {
    return await db.select().from(video).where(inArray(video.youtubeId, ids));
  }

  async get(videoId: string) {
    const [result] = await db
      .select({
        videoId: video.youtubeId,
        title: video.title,
        description: video.description,
        url: video.url,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        youtubeCreatedAt: video.youtubeCreatedAt,
        channelId: video.channelId,
        channelName: channel.name,
        channelUrl: channel.url,
        channelAvatarUrl: channel.avatarUrl,
        channelCreatedAt: channel.youtubeCreatedAt,
      })
      .from(video)
      .where(eq(video.youtubeId, videoId))
      .innerJoin(channel, eq(channel.youtubeId, video.channelId))
      .limit(1);

    return result;
  }
}
