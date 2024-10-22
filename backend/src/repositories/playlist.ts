import { eq, inArray } from "drizzle-orm";

import db from "@/db";
import { playlist, playlistVideo } from "@/db/schema";
import { insertPlaylist, insertPlaylistVideo } from "@/types";

export default class PlaylistRepository {
  async createPlaylist(data: insertPlaylist) {
    const [result] = await db.insert(playlist).values(data).returning();

    return result;
  }

  async addVideos(videos: insertPlaylistVideo[]) {
    return await db.insert(playlistVideo).values(videos).returning();
  }

  async getExistingPlaylistIds(ids: string[]) {
    return await db
      .select({ id: playlist.youtubeId })
      .from(playlist)
      .where(inArray(playlist.youtubeId, ids));
  }

  async getPlaylistVideoIds(playlistId: string) {
    return await db
      .select({ id: playlistVideo.youtubeVideoId })
      .from(playlistVideo)
      .where(eq(playlistVideo.youtubePlaylistId, playlistId));
  }
}
