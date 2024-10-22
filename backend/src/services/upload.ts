import {
  VideoService,
  ChannelService,
  YoutubeService,
  WatchedVideoService,
  PlaylistService,
} from "@/services";

import { Upload } from "@/controllers/upload";

import parseISODuration from "@/lib/parse-iso-duration";
import mergeItems from "@/lib/mergeItems";
import chunkArray from "@/lib/chunk-array";

import {
  insertChannel,
  insertPlaylistVideo,
  insertVideo,
  insertWatchedVideo,
} from "@/types";
import size from "@/constants/size";

const { DB_CHUNK_SIZE } = size;

export default class UploadService {
  constructor(
    private readonly videoService: VideoService,
    private readonly channelService: ChannelService,
    private readonly youtubeService: YoutubeService,
    private readonly watchedVideoService: WatchedVideoService,
    private readonly playlistService: PlaylistService,
  ) {}

  async processUpload(upload: Upload) {
    const uniqueVideoIds = new Set<string>();
    const uniqueChannelIds = new Set<string>();
    const playlistIds: string[] = [];

    const videosToInsert: insertVideo[][] = [];
    const channelsToInsert: insertChannel[][] = [];

    for (const video of upload.history) {
      uniqueVideoIds.add(video.videoId);
    }

    for (const playlist of upload.playlists) {
      playlistIds.push(playlist.id);
      for (const video of playlist.videos) {
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
          description: video.snippet.description,
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

    const existingPlaylistIds =
      await this.playlistService.getExistingPlaylistIds(playlistIds);

    const response: {
      history: (Video & { watchedAt: string })[];
      playlists: {
        id: string;
        title: string;
        createdAt: string;
        updatedAt: string;
        visibility: string;
        new: boolean;
        videos: (Video & { addedAt: string; new: boolean })[];
      }[];
    } = { history: [], playlists: [] };

    for (const item of upload.history) {
      const video = allVideos.get(item.videoId);
      if (!video) continue;

      const channel = allChannels.get(video.channelId);
      if (!channel) continue;

      response.history.push({
        title: video.title,
        url: video.url,
        videoId: video.youtubeId,
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

    for (const { videos, ...rest } of upload.playlists) {
      const isPlaylistNew = !existingPlaylistIds.has(rest.id);
      response.playlists.push({ ...rest, new: isPlaylistNew, videos: [] });

      const existingPlaylistVideoIds =
        await this.playlistService.getPlaylistVideoIds(rest.id);

      for (const item of videos) {
        const video = allVideos.get(item.videoId);
        if (!video) continue; // this should never happen

        const channel = allChannels.get(video.channelId);
        if (!channel) continue; // this should never happen

        const isVideoNew = !existingPlaylistVideoIds.has(video.youtubeId);

        response.playlists[response.playlists.length - 1]!.videos.push({
          title: video.title,
          url: video.url,
          videoId: video.youtubeId,
          channelId: video.channelId,
          duration: video.duration,
          thumbnailUrl: video.thumbnailUrl,
          youtubeCreatedAt: video.youtubeCreatedAt,
          channelName: channel.name,
          channelUrl: channel.url,
          channelAvatarUrl: channel.avatarUrl,
          addedAt: item.addedAt,
          new: isVideoNew,
        });
      }
    }

    return response;
  }

  async uploadData(upload: Upload, userId: string) {
    const { history, playlists } = upload;

    const historyChunks: insertWatchedVideo[][] = chunkArray(
      history.map((video) => ({
        userId,
        youtubeVideoId: video.videoId,
        youtubeCreatedAt: new Date(video.watchedAt),
      })),
      DB_CHUNK_SIZE,
    );

    await this.watchedVideoService.bulkCreate(historyChunks);

    for (const playlist of playlists) {
      const playlistData = await this.playlistService.createPlaylist({
        youtubeId: playlist.id,
        name: playlist.title,
        youtubeCreatedAt: new Date(playlist.createdAt),
        youtubeUpdatedAt: new Date(playlist.updatedAt),
        userId,
      });

      const videoChunks: insertPlaylistVideo[][] = chunkArray(
        playlist.videos.map((item) => ({
          youtubeVideoId: item.videoId,
          youtubeCreatedAt: new Date(item.addedAt),
          youtubePlaylistId: playlistData.youtubeId,
        })),
        DB_CHUNK_SIZE,
      );

      await this.playlistService.bulkAddVideos(videoChunks);
    }

    return "ok";
  }
}

type Video = {
  title: string;
  url: string;
  videoId: string;
  channelId: string;
  channelName: string;
  channelUrl: string;
  channelAvatarUrl: string;
  thumbnailUrl: string;
  duration: number;
  youtubeCreatedAt: Date;
};
