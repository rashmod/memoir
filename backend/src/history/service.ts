import { channel, video, watchedVideo } from "@/db/schema";

import VideoService from "@/services/video";
import ChannelService from "@/services/channel";
import YoutubeService from "@/services/youtube";
import WatchedVideoService from "@/services/watched-videos";

import { HistoryVideo } from "@/history/controller";

import parseISODuration from "@/lib/parse-iso-duration";
import mergeItems from "@/lib/mergeItems";

import size from "@/constants/size";

const { DB_CHUNK_SIZE } = size;

export default class HistoryService {
  constructor(
    private readonly videoService: VideoService,
    private readonly channelService: ChannelService,
    private readonly youtubeService: YoutubeService,
    private readonly watchedVideoService: WatchedVideoService,
  ) {}

  async processHistory(history: HistoryVideo[]) {
    const videoSet = new Set<string>(history.map((item) => item.youtubeId));
    const channelSet = new Set<string>();

    const videosToInsert: (typeof video.$inferInsert)[][] = [];
    const channelsToInsert: (typeof channel.$inferInsert)[][] = [];

    const [missingVideoIds, existingVideos] =
      await this.videoService.getMissingVideoIds(videoSet, DB_CHUNK_SIZE);

    const videoDetails = await this.youtubeService.getVideos(missingVideoIds);

    for (const videos of existingVideos) {
      for (const video of videos) {
        channelSet.add(video.channelId);
      }
    }

    for (const details of videoDetails) {
      videosToInsert.push([]);

      for (const video of details.items) {
        channelSet.add(video.snippet.channelId);

        videosToInsert[videosToInsert.length - 1]?.push({
          youtubeId: video.id,
          title: video.snippet.title,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          duration: parseISODuration(video.contentDetails.duration),
          channelId: video.snippet.channelId,
          thumbnailUrl: this.youtubeService.getThumbnailUrl(
            video.snippet.thumbnails,
          ),
          youtubeCreatedAt: new Date(video.snippet.publishedAt),
        });
      }
    }

    const [missingChannelIds, existingChannels] =
      await this.channelService.getMissingChannelIds(channelSet, DB_CHUNK_SIZE);

    const channelDetails =
      await this.youtubeService.getChannels(missingChannelIds);

    for (const details of channelDetails) {
      channelsToInsert.push([]);

      for (const channel of details.items) {
        channelsToInsert[channelsToInsert.length - 1]?.push({
          youtubeId: channel.id,
          url: `https://www.youtube.com/channel/${channel.id}`,
          name: channel.snippet.title,
          youtubeCreatedAt: new Date(channel.snippet.publishedAt),
          avatarUrl: this.youtubeService.getThumbnailUrl(
            channel.snippet.thumbnails,
          ),
        });
      }
    }

    const newChannels = await this.channelService.bulkCreate(
      channelsToInsert.filter((item) => item.length > 0),
    );

    const newVideos = await this.videoService.bulkCreate(
      videosToInsert.filter((item) => item.length > 0),
    );

    const allVideos = mergeItems(
      existingVideos,
      newVideos,
      (item) => item.youtubeId,
    );

    const allChannels = mergeItems(
      existingChannels,
      newChannels,
      (item) => item.youtubeId,
    );

    const response: {
      title: string;
      url: string;
      youtubeId: string;
      channelId: string;
      channelName: string;
      channelUrl: string;
      channelAvatarUrl: string;
      thumbnailUrl: string;
      duration: number;
      youtubeCreatedAt: Date;
      time: string;
    }[] = [];

    for (const item of history) {
      const video = allVideos.get(item.youtubeId);
      if (!video) continue;

      const channel = allChannels.get(video.channelId);
      if (!channel) continue;

      response.push({
        title: video.title,
        url: video.url,
        youtubeId: video.youtubeId,
        channelId: video.channelId,
        duration: video.duration,
        thumbnailUrl: video.thumbnailUrl,
        youtubeCreatedAt: video.youtubeCreatedAt,
        channelName: channel.name,
        channelUrl: channel.url,
        channelAvatarUrl: channel.avatarUrl,
        time: item.time,
      });
    }

    return response;
  }

  async uploadHistory(history: HistoryVideo[], userId: string) {
    const watchedVideos: (typeof watchedVideo.$inferInsert)[][] = [[]];

    for (const video of history) {
      if (watchedVideos[watchedVideos.length - 1]?.length! >= DB_CHUNK_SIZE)
        watchedVideos.push([]);

      watchedVideos[watchedVideos.length - 1]?.push({
        userId,
        youtubeVideoId: video.youtubeId,
        youtubeCreatedAt: new Date(video.time),
      });
    }

    if (watchedVideos.length > 0)
      await this.watchedVideoService.bulkCreate(watchedVideos);

    return "ok";
  }

  async getHistory(userId: string) {
    return await this.watchedVideoService.getAll(userId);
  }
}
