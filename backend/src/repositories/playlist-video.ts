import db from "@/db";
import { playlistVideo } from "@/db/schema";
import { insertPlaylistVideo } from "@/types";

export default class PlaylistVideoRepository {
  async create(videos: insertPlaylistVideo[]) {
    return await db.insert(playlistVideo).values(videos).returning();
  }
}
