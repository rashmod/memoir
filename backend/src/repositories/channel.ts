import { sql } from "drizzle-orm";

import db from "@/db";
import { channel } from "@/db/schema";

import formatExcludedColumns from "@/lib/format-excluded-columns";
import formatTableColumnName from "@/lib/format-table-column-name";

export default class ChannelRepository {
  async createOrUpdate(channels: Array<typeof channel.$inferInsert>) {
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

  async update() {
    throw new Error("Not implemented");
  }

  async delete() {
    throw new Error("Not implemented");
  }

  async get() {
    throw new Error("Not implemented");
  }

  async getAll() {
    throw new Error("Not implemented");
  }
}
