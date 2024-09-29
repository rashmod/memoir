import express from "express";

import { channel, video, watchedVideo } from "@/db/schema";

import VideoRepository from "@/repositories/video";
import ChannelRepository from "@/repositories/channel";
import WatchedVideoRepository from "@/repositories/watchedVideo";

import YoutubeService from "@/services/youtube";
import ChannelService from "@/services/channel";
import WatchedVideoService from "@/services/watched-videos";
import VideoService from "@/services/video";

import parseISODuration from "@/lib/parse-iso-duration";

const router = express.Router();

const DB_CHUNK_SIZE = 100;

router.get("/", (req, res) => res.send("hello"));

// TODO handle when the missing videos or channels count is zero
// TODO what is the response if a channel is deleted from youtube
// TODO what should be done to video if a channel is deleted from youtube

router.post(
  "/add-file",
  async (req: express.Request, res: express.Response) => {
    console.log("req made to add-file endpoint");

    const { history }: { history: HistoryVideo[] } = req.body;

    const videoRepository = new VideoRepository();
    const channelRepository = new ChannelRepository();

    const videoService = new VideoService(videoRepository);
    const channelService = new ChannelService(channelRepository);
    const youtubeService = new YoutubeService();

    const videoSet = new Set<string>(history.map((item) => item.youtubeId));
    const channelSet = new Set<string>();

    const videosToInsert: (typeof video.$inferInsert)[][] = [];
    const channelsToInsert: (typeof channel.$inferInsert)[][] = [];

    const [missingVideoIds, existingVideos] =
      await videoService.getMissingVideoIds(videoSet, DB_CHUNK_SIZE);

    const videoDetails = await youtubeService.getVideos(missingVideoIds);

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
          thumbnailUrl: youtubeService.getThumbnailUrl(
            video.snippet.thumbnails,
          ),
          youtubeCreatedAt: new Date(video.snippet.publishedAt),
        });
      }
    }

    const [missingChannelIds, existingChannels] =
      await channelService.getMissingChannelIds(channelSet, DB_CHUNK_SIZE);

    const channelDetails = await youtubeService.getChannels(missingChannelIds);

    for (const details of channelDetails) {
      channelsToInsert.push([]);

      for (const channel of details.items) {
        channelsToInsert[channelsToInsert.length - 1]?.push({
          youtubeId: channel.id,
          url: `https://www.youtube.com/channel/${channel.id}`,
          name: channel.snippet.title,
          youtubeCreatedAt: new Date(channel.snippet.publishedAt),
          avatarUrl: youtubeService.getThumbnailUrl(channel.snippet.thumbnails),
        });
      }
    }

    const newChannels = await (async () => {
      if (channelsToInsert.some((item) => item.length > 0)) {
        return await channelService.bulkCreate(
          channelsToInsert.filter((item) => item.length > 0),
        );
      }
      return [];
    })();

    const newVideos = await (async () => {
      if (videosToInsert.some((item) => item.length > 0)) {
        return await videoService.bulkCreate(
          videosToInsert.filter((item) => item.length),
        );
      }
      return [];
    })();

    const allVideos = new Map<
      string,
      {
        title: string;
        url: string;
        youtubeId: string;
        channelId: string;
        thumbnailUrl: string;
        duration: number;
        youtubeCreatedAt: Date;
      }
    >();

    const allChannels = new Map<
      string,
      { url: string; name: string; avatarUrl: string }
    >();

    for (const videos of existingVideos) {
      for (const video of videos) {
        allVideos.set(video.youtubeId, {
          youtubeId: video.youtubeId,
          youtubeCreatedAt: video.youtubeCreatedAt,
          duration: video.duration,
          thumbnailUrl: video.thumbnailUrl,
          url: video.url,
          title: video.title,
          channelId: video.channelId,
        });
      }
    }

    for (const videos of newVideos) {
      for (const video of videos) {
        allVideos.set(video.youtubeId, {
          youtubeId: video.youtubeId,
          youtubeCreatedAt: video.youtubeCreatedAt,
          duration: video.duration,
          thumbnailUrl: video.thumbnailUrl,
          url: video.url,
          title: video.title,
          channelId: video.channelId,
        });
      }
    }

    for (const channels of existingChannels) {
      for (const channel of channels) {
        allChannels.set(channel.youtubeId, {
          url: channel.url,
          name: channel.name,
          avatarUrl: channel.avatarUrl,
        });
      }
    }

    for (const channels of newChannels) {
      for (const channel of channels) {
        allChannels.set(channel.youtubeId, {
          url: channel.url,
          name: channel.name,
          avatarUrl: channel.avatarUrl,
        });
      }
    }

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

    res.status(200).json({ message: "ok", data: response });
  },
);

router.post(
  "/upload-history",
  async (req: express.Request, res: express.Response) => {
    const { history }: { history: HistoryVideo[] } = req.body;

    const videoRepository = new VideoRepository();
    const channelRepository = new ChannelRepository();
    const watchedVideoRepository = new WatchedVideoRepository();

    const videoService = new VideoService(videoRepository);
    const channelService = new ChannelService(channelRepository);
    const watchedVideoService = new WatchedVideoService(watchedVideoRepository);
    const youtubeService = new YoutubeService();

    const watchedVideos: (typeof watchedVideo.$inferInsert)[][] = [[]];

    const videoSet = new Set<string>();
    const channelSet = new Set<string>();

    const videosToInsert: (typeof video.$inferInsert)[][] = [];
    const channelsToInsert: (typeof channel.$inferInsert)[][] = [];

    const userId = "0e4fce12-3606-4a66-b545-17b219682451";

    for (const video of history) {
      videoSet.add(video.youtubeId);

      if (watchedVideos[watchedVideos.length - 1]?.length! > DB_CHUNK_SIZE)
        watchedVideos.push([]);

      watchedVideos[watchedVideos.length - 1]?.push({
        userId,
        youtubeVideoId: video.youtubeId,
        youtubeCreatedAt: new Date(video.time),
      });
    }

    const [missingVideoIds] = await videoService.getMissingVideoIds(
      videoSet,
      DB_CHUNK_SIZE,
    );

    const videoDetails = await youtubeService.getVideos(missingVideoIds);

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
          thumbnailUrl: youtubeService.getThumbnailUrl(
            video.snippet.thumbnails,
          ),
          youtubeCreatedAt: new Date(video.snippet.publishedAt),
        });
      }
    }

    const [missingChannelIds] = await channelService.getMissingChannelIds(
      channelSet,
      DB_CHUNK_SIZE,
    );

    const channelDetails = await youtubeService.getChannels(missingChannelIds);

    for (const details of channelDetails) {
      channelsToInsert.push([]);

      for (const channel of details.items) {
        channelsToInsert[channelsToInsert.length - 1]?.push({
          youtubeId: channel.id,
          url: `https://www.youtube.com/channel/${channel.id}`,
          name: channel.snippet.title,
          youtubeCreatedAt: new Date(channel.snippet.publishedAt),
          avatarUrl: youtubeService.getThumbnailUrl(channel.snippet.thumbnails),
        });
      }
    }

    if (channelsToInsert.length > 0)
      await channelService.bulkCreate(channelsToInsert);
    if (videosToInsert.length > 0)
      await videoService.bulkCreate(videosToInsert);
    if (watchedVideos.length > 0)
      await watchedVideoService.bulkCreate(watchedVideos);

    res.status(200).json({ message: "ok" });
  },
);

export default router;

type HistoryVideo = {
  title: string;
  time: string;
  url: string;
  youtubeId: string;
};
