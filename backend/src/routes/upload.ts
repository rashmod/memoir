import express from "express";

import { UploadController } from "@/controllers";
import {
  UploadService,
  YoutubeService,
  VideoService,
  ChannelService,
  WatchedVideoService,
  PlaylistService,
} from "@/services";
import {
  VideoRepository,
  ChannelRepository,
  WatchedVideoRepository,
  PlaylistRepository,
} from "@/repositories";

const router = express.Router();

const videoRepository = new VideoRepository();
const channelRepository = new ChannelRepository();
const watchedVideoRepository = new WatchedVideoRepository();
const playlistRepository = new PlaylistRepository();

const videoService = new VideoService(videoRepository);
const channelService = new ChannelService(channelRepository);
const youtubeService = new YoutubeService();
const watchedVideoService = new WatchedVideoService(watchedVideoRepository);
const playlistService = new PlaylistService(playlistRepository);
const uploadService = new UploadService(
  videoService,
  channelService,
  youtubeService,
  watchedVideoService,
  playlistService,
);

const uploadController = new UploadController(uploadService);

router.post("/add-file", uploadController.addFile);
router.post("/upload-file", uploadController.uploadData);

export default router;
