import express from "express";

import VideoRepository from "@/repositories/video";
import ChannelRepository from "@/repositories/channel";
import WatchedVideoRepository from "@/repositories/watchedVideo";

import YoutubeService from "@/services/youtube";
import ChannelService from "@/services/channel";
import WatchedVideoService from "@/services/watched-videos";
import VideoService from "@/services/video";

import HistoryController from "@/history/controller";
import HistoryService from "@/history/service";

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

router.post("/add-file", historyController.addFile);
router.post("/upload-history", historyController.uploadHistory);

export default router;
