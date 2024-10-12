import express from "express";

import { HistoryController } from "@/controllers";
import {
  HistoryService,
  YoutubeService,
  VideoService,
  ChannelService,
  WatchedVideoService,
} from "@/services";
import {
  VideoRepository,
  ChannelRepository,
  WatchedVideoRepository,
} from "@/repositories";

const router = express.Router();

// TODO what is the response if a channel is deleted from youtube
// TODO what should be done to video if a channel is deleted from youtube

const videoRepository = new VideoRepository();
const channelRepository = new ChannelRepository();
const watchedVideoRepository = new WatchedVideoRepository();

const videoService = new VideoService(videoRepository);
const channelService = new ChannelService(channelRepository);
const watchedVideoService = new WatchedVideoService(watchedVideoRepository);
const youtubeService = new YoutubeService();
const historyService = new HistoryService(
  videoService,
  channelService,
  youtubeService,
  watchedVideoService,
);

const historyController = new HistoryController(historyService);

router.get("/", historyController.getHistory);
router.post("/add-file", historyController.addFile);
router.post("/upload-history", historyController.uploadHistory);

export default router;
