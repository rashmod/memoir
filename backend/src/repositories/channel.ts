import { inArray, sql } from "drizzle-orm";

import db from "@/db";
import { channel } from "@/db/schema";

import formatExcludedColumns from "@/lib/format-excluded-columns";
import formatTableColumnName from "@/lib/format-table-column-name";

export default class ChannelRepository {
  async create(channels: (typeof channel.$inferInsert)[]) {
    return await db.insert(channel).values(channels).returning();
  }

  async createOrUpdate(channels: (typeof channel.$inferInsert)[]) {
    return await db
      .insert(channel)
      .values(channels)
      .onConflictDoUpdate({
        target: channel.youtubeId,
        set: {
          name: sql.raw(formatExcludedColumns(channel, "name")),
          avatarUrl: sql.raw(formatExcludedColumns(channel, "avatarUrl")),
          updatedAt: sql.raw(
            `CASE 
                WHEN (
                    ${formatTableColumnName(channel, "name")} <> ${formatExcludedColumns(channel, "name")}
                ) 
                THEN NOW() 
                ELSE ${formatTableColumnName(channel, "updatedAt")} 
            END`,
          ),
        },
      })
      .returning();
  }

  async getExisting(ids: string[]) {
    return await db
      .select()
      .from(channel)
      .where(inArray(channel.youtubeId, ids));
  }
}
