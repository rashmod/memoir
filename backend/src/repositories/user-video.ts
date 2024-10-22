import { and, count, desc, eq, max } from "drizzle-orm";

import db from "@/db";
import {
  channel,
  playlist,
  playlistVideo,
  video,
  watchedVideo,
} from "@/db/schema";

export default class UserVideoRepository {
  async getHistory(userId: string) {
    const historySubquery = db
      .select({
        youtubeId: watchedVideo.youtubeVideoId,
        watchCount: count(watchedVideo.youtubeVideoId).as("watchCount"),
        lastWatchedAt: max(watchedVideo.youtubeCreatedAt).as("lastWatchedAt"),
      })
      .from(watchedVideo)
      .where(eq(watchedVideo.userId, userId))
      .groupBy(watchedVideo.youtubeVideoId)
      .as("history_subquery");

    const history = await db
      .select({
        videoId: historySubquery.youtubeId,
        title: video.title,
        url: video.url,
        lastWatchedAt: historySubquery.lastWatchedAt,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        youtubeCreatedAt: video.youtubeCreatedAt,
        channelId: video.channelId,
        channelName: channel.name,
        channelUrl: channel.url,
        channelAvatarUrl: channel.avatarUrl,
        watchCount: historySubquery.watchCount,
      })
      .from(historySubquery)
      .innerJoin(video, eq(historySubquery.youtubeId, video.youtubeId))
      .innerJoin(channel, eq(channel.youtubeId, video.channelId))
      .orderBy(desc(historySubquery.lastWatchedAt));

    return history;
  }

  async getPlaylists(userId: string) {
    const playlists = await db
      .select({
        videoId: playlistVideo.youtubeVideoId,
        title: video.title,
        url: video.url,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        youtubeCreatedAt: video.youtubeCreatedAt,
        channelId: video.channelId,
        channelName: channel.name,
        channelUrl: channel.url,
        channelAvatarUrl: channel.avatarUrl,
        playlistName: playlist.name,
      })
      .from(playlist)
      .where(eq(playlist.userId, userId))
      .innerJoin(
        playlistVideo,
        eq(playlistVideo.youtubePlaylistId, playlist.youtubeId),
      )
      .innerJoin(video, eq(video.youtubeId, playlistVideo.youtubeVideoId))
      .innerJoin(channel, eq(channel.youtubeId, video.channelId))
      .orderBy(desc(playlistVideo.youtubeCreatedAt));

    return playlists;
  }

  async getVideoHistory(userId: string, videoId: string) {
    const history = await db
      .select({ watchedAt: watchedVideo.youtubeCreatedAt })
      .from(watchedVideo)
      .where(
        and(
          eq(watchedVideo.userId, userId),
          eq(watchedVideo.youtubeVideoId, videoId),
        ),
      )
      .orderBy(desc(watchedVideo.youtubeCreatedAt));

    return history;
  }

  async getVideoPlaylists(userId: string, videoId: string) {
    const playlists = await db
      .select({
        playlistId: playlist.youtubeId,
        playlistName: playlist.name,
        addedAt: playlistVideo.youtubeCreatedAt,
      })
      .from(playlist)
      .where(
        and(
          eq(playlist.userId, userId),
          eq(playlistVideo.youtubeVideoId, videoId),
        ),
      )
      .innerJoin(
        playlistVideo,
        eq(playlistVideo.youtubePlaylistId, playlist.youtubeId),
      )
      .orderBy(desc(playlistVideo.youtubeCreatedAt));

    return playlists;
  }
}
