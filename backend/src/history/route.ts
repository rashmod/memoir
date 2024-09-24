import express from "express";

import db from "@/db";
import { video, watchedVideo } from "@/db/schema";

import VideoRepository from "@/repositories/video";
import ChannelRepository from "@/repositories/channel";

const router = express.Router();

router.post(
  "/upload-history",
  async (req: express.Request, res: express.Response) => {
    const { history }: { history: HistoryVideo[] } = req.body;

    const channels: {
      set: Set<string>;
      arr: { youtubeId: string; name: string; url: string }[];
    } = { set: new Set<string>(), arr: [] };

    const videos: {
      set: Set<string>;
      arr: Array<typeof video.$inferInsert>;
    } = { set: new Set<string>(), arr: [] };

    const watchedVideos: Array<typeof watchedVideo.$inferInsert> = [];

    for (const video of history) {
      if (!channels.set.has(video.channelId)) {
        channels.set.add(video.channelId);
        channels.arr.push({
          youtubeId: video.channelId,
          name: video.channelTitle,
          url: video.channelUrl,
        });
      }

      if (!videos.set.has(video.youtubeId)) {
        videos.set.add(video.youtubeId);
        videos.arr.push({
          youtubeId: video.youtubeId,
          title: video.title,
          duration: video.duration,
          url: video.url,
          thumbnailUrl: video.thumbnail,
          youtubeCreatedAt: new Date(video.youtubeCreatedAt),
          channelId: video.channelId,
        });
      }

      watchedVideos.push({
        userId: "0e4fce12-3606-4a66-b545-17b219682451",
        youtubeCreatedAt: new Date(video.time),
        youtubeVideoId: video.youtubeId,
      });
    }

    const channelRepository = new ChannelRepository();

    await channelRepository.createOrUpdate(channels.arr);

    const videoRepository = new VideoRepository();

    await videoRepository.createOrUpdate(videos.arr);

    await db.insert(watchedVideo).values(watchedVideos);

    res.status(200).json({ message: "ok" });
  },
);

export default router;

type HistoryVideo = {
  youtubeId: string;
  title: string;
  url: string;
  time: string;
  channelId: string;
  channelTitle: string;
  channelUrl: string;
  thumbnail: string;
  duration: number;
  youtubeCreatedAt: string;
};
