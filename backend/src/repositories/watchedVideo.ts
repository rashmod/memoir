import db from "@/db";
import { watchedVideo } from "@/db/schema";
import { insertWatchedVideo } from "@/types";

export default class WatchedVideoRepository {
  async create(videos: insertWatchedVideo[]) {
    return await db.insert(watchedVideo).values(videos).returning();
  }
}
