import db from "@/db";
import { watchedVideo } from "@/db/schema";

export default class WatchedVideoRepository {
  async create(videos: (typeof watchedVideo.$inferInsert)[]) {
    return await db.insert(watchedVideo).values(videos).returning();
  }
}
