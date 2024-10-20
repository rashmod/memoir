import { channel, video } from "@/db/schema";

import { VideoService, ChannelService, YoutubeService } from "@/services";

import { Upload } from "@/controllers/upload";

import parseISODuration from "@/lib/parse-iso-duration";
import mergeItems from "@/lib/mergeItems";

import size from "@/constants/size";

const { DB_CHUNK_SIZE } = size;

export default class UploadService {
  constructor(
    private readonly videoService: VideoService,
    private readonly channelService: ChannelService,
    private readonly youtubeService: YoutubeService,
  ) {}

  async processUpload(upload: Upload) {
    const uniqueVideoIds = new Set<string>();
    const uniqueChannelIds = new Set<string>();

    const videosToInsert: (typeof video.$inferInsert)[][] = [];
    const channelsToInsert: (typeof channel.$inferInsert)[][] = [];

    for (const video of upload.history) {
      uniqueVideoIds.add(video.videoId);
    }

    for (const playlist of upload.playlists) {
      for (const video of playlist) {
        uniqueVideoIds.add(video.videoId);
      }
    }

    const [missingVideoIds, existingVideos] =
      await this.videoService.getMissingVideoIds(uniqueVideoIds, DB_CHUNK_SIZE);

    const missingVideoDetails =
      await this.youtubeService.getVideos(missingVideoIds);

    for (const videos of existingVideos) {
      for (const video of videos) {
        uniqueChannelIds.add(video.channelId);
      }
    }

    for (const details of missingVideoDetails) {
      videosToInsert.push([]);

      for (const video of details.items) {
        uniqueChannelIds.add(video.snippet.channelId);

        videosToInsert[videosToInsert.length - 1]!.push({
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
      await this.channelService.getMissingChannelIds(
        uniqueChannelIds,
        DB_CHUNK_SIZE,
      );

    const missingChannelDetails =
      await this.youtubeService.getChannels(missingChannelIds);

    for (const details of missingChannelDetails) {
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
      history: (Video & { watchedAt: string })[];
      playlist: (Video & { addedAt: string })[][];
    } = { history: [], playlist: [] };

    for (const item of upload.history) {
      const video = allVideos.get(item.videoId);
      if (!video) continue;

      const channel = allChannels.get(video.channelId);
      if (!channel) continue;

      response.history.push({
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
        watchedAt: item.watchedAt,
      });
    }

    for (const playlist of upload.playlists) {
      response.playlist.push([]);

      for (const item of playlist) {
        const video = allVideos.get(item.videoId);
        if (!video) continue;

        const channel = allChannels.get(video.channelId);
        if (!channel) continue;

        response.playlist[response.playlist.length - 1]!.push({
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
          addedAt: item.addedAt,
        });
      }
    }

    return response;
  }
}

type Video = {
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
};
