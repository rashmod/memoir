import express from "express";

import { channel, video, watchedVideo } from "@/db/schema";

import VideoRepository from "@/repositories/video";
import ChannelRepository from "@/repositories/channel";

import YoutubeService from "@/services/youtube";
import ChannelService from "@/services/channel";
import VideoService from "@/services/video";

import parseISODuration from "@/lib/parse-iso-duration";

const router = express.Router();

const DB_CHUNK_SIZE = 100;

router.post(
  "/upload-history",
  async (req: express.Request, res: express.Response) => {
    const { history }: { history: HistoryVideo[] } = req.body;

    const videoRepository = new VideoRepository();
    const channelRepository = new ChannelRepository();

    const videoService = new VideoService(videoRepository);
    const channelService = new ChannelService(channelRepository);
    const youtubeService = new YoutubeService();

    const watchedVideos: (typeof watchedVideo.$inferInsert)[] = [];

    const videoSet = new Set<string>();
    const channelSet = new Set<string>();

    const videosToInsert: (typeof video.$inferInsert)[][] = [];
    const channelsToInsert: (typeof channel.$inferInsert)[][] = [];

    const userId = "0e4fce12-3606-4a66-b545-17b219682451";

    for (const video of history) {
      videoSet.add(video.youtubeId);

      watchedVideos.push({
        userId,
        youtubeVideoId: video.youtubeId,
        youtubeCreatedAt: new Date(video.time),
      });
    }

    const missingVideoIds = await videoService.getMissingVideoIds(
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

    const missingChannelIds = await channelService.getMissingChannelIds(
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

    await channelService.bulkCreate(channelsToInsert);
    await videoService.bulkCreate(videosToInsert);

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
