import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  gt,
  lt,
  max,
  sql,
  sum,
  sumDistinct,
} from "drizzle-orm";

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

  // TODO group video based on date based on users timezone
  async getSummary(userId: string, startDate: Date, endDate: Date) {
    const historySummary = await db
      .select({
        date: sql<string>`(watched_video.youtube_created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::date`.as(
          "date",
        ),
        count: count(watchedVideo.youtubeVideoId),
        uniqueCount: countDistinct(watchedVideo.youtubeVideoId),
        duration: sum(video.duration).mapWith(Number),
        uniqueDuration: sumDistinct(video.duration).mapWith(Number),
      })
      .from(watchedVideo)
      .innerJoin(video, eq(video.youtubeId, watchedVideo.youtubeVideoId))
      .where(
        and(
          eq(watchedVideo.userId, userId),
          gt(watchedVideo.youtubeCreatedAt, startDate),
          lt(watchedVideo.youtubeCreatedAt, endDate),
        ),
      )
      .groupBy(
        sql`(watched_video.youtube_created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')::date`,
      )
      .orderBy(sql`date`);

    const channelSummary = await db
      .select({
        channelId: video.channelId,
        channelName: max(channel.name),
        channelAvatarUrl: max(channel.avatarUrl),
        count: count(watchedVideo.youtubeVideoId),
        duration: sum(video.duration).mapWith(Number),
      })
      .from(watchedVideo)
      .innerJoin(video, eq(video.youtubeId, watchedVideo.youtubeVideoId))
      .innerJoin(channel, eq(channel.youtubeId, video.channelId))
      .where(
        and(
          eq(watchedVideo.userId, userId),
          gt(watchedVideo.youtubeCreatedAt, startDate),
          lt(watchedVideo.youtubeCreatedAt, endDate),
        ),
      )
      .groupBy(video.channelId)
      .orderBy(desc(count(watchedVideo.youtubeVideoId)));

    const watchLaterSummary = await db
      .select({
        channelId: video.channelId,
        channelName: max(channel.name),
        channelAvatarUrl: max(channel.avatarUrl),
        count: count(playlistVideo.youtubeVideoId).mapWith(Number),
        duration: sum(video.duration).mapWith(Number),
      })
      .from(playlist)
      .innerJoin(
        playlistVideo,
        eq(playlistVideo.youtubePlaylistId, playlist.youtubeId),
      )
      .innerJoin(video, eq(video.youtubeId, playlistVideo.youtubeVideoId))
      .innerJoin(channel, eq(channel.youtubeId, video.channelId))
      .where(
        and(
          eq(playlist.userId, userId),
          eq(playlist.name, "Watch later"),
          gt(playlistVideo.youtubeCreatedAt, startDate),
          lt(playlistVideo.youtubeCreatedAt, endDate),
        ),
      )
      .groupBy(video.channelId)
      .orderBy(desc(count(playlistVideo.youtubeVideoId)));

    return { historySummary, channelSummary, watchLaterSummary };
  }
}
