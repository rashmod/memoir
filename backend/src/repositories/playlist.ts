import { eq, inArray } from "drizzle-orm";

import db from "@/db";
import { playlist, playlistVideo } from "@/db/schema";
import { insertPlaylist, insertPlaylistVideo } from "@/types";
import updateTimestampsIfChanged from "@/lib/on-conflict-update";

export default class PlaylistRepository {
  async createPlaylist(data: insertPlaylist) {
    const [result] = await db
      .insert(playlist)
      .values(data)
      .onConflictDoUpdate({
        target: playlist.youtubeId,
        set: updateTimestampsIfChanged(
          playlist,
          ["name", "youtubeUpdatedAt"],
          "updatedAt",
        ),
      })
      .returning();

    return result;
  }

  async addVideos(videos: insertPlaylistVideo[]) {
    return await db
      .insert(playlistVideo)
      .values(videos)
      .onConflictDoNothing({
        target: [playlistVideo.youtubePlaylistId, playlistVideo.youtubeVideoId],
      })
      .returning();
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
