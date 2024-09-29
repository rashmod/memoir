import { inArray, sql } from "drizzle-orm";

import db from "@/db";
import { video } from "@/db/schema";

import formatExcludedColumns from "@/lib/format-excluded-columns";
import formatTableColumnName from "@/lib/format-table-column-name";

export default class VideoRepository {
  async create(videos: (typeof video.$inferInsert)[]) {
    return await db.insert(video).values(videos).returning();
  }

  async createOrUpdate(videos: Array<typeof video.$inferInsert>) {
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
}
