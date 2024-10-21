import {
  channel,
  playlist,
  playlistVideo,
  video,
  watchedVideo,
} from "@/db/schema";

export type insertPlaylist = typeof playlist.$inferInsert;
export type insertPlaylistVideo = typeof playlistVideo.$inferInsert;

export type insertWatchedVideo = typeof watchedVideo.$inferInsert;

export type insertChannel = typeof channel.$inferInsert;

export type insertVideo = typeof video.$inferInsert;
