import express from "express";

import { HistoryController } from "@/controllers";
import { HistoryService, VideoService, WatchedVideoService } from "@/services";
import { VideoRepository, WatchedVideoRepository } from "@/repositories";

const router = express.Router();

// TODO what is the response if a channel is deleted from youtube
// TODO what should be done to video if a channel is deleted from youtube

const videoRepository = new VideoRepository();
const watchedVideoRepository = new WatchedVideoRepository();

const videoService = new VideoService(videoRepository);
const watchedVideoService = new WatchedVideoService(watchedVideoRepository);
const historyService = new HistoryService(watchedVideoService);

const historyController = new HistoryController(historyService, videoService);

router.get("/:videoId", historyController.getVideoHistory);

export default router;
