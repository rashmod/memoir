import express from "express";

import { UploadController } from "@/controllers";
import {
  UploadService,
  YoutubeService,
  VideoService,
  ChannelService,
  WatchedVideoService,
  PlaylistService,
  PlaylistVideoService,
} from "@/services";
import {
  VideoRepository,
  ChannelRepository,
  WatchedVideoRepository,
  PlaylistRepository,
  PlaylistVideoRepository,
} from "@/repositories";

const router = express.Router();

// TODO what is the response if a channel is deleted from youtube
// TODO what should be done to video if a channel is deleted from youtube

const videoRepository = new VideoRepository();
const channelRepository = new ChannelRepository();
const watchedVideoRepository = new WatchedVideoRepository();
const playlistRepository = new PlaylistRepository();
const playlistVideoRepository = new PlaylistVideoRepository();

const videoService = new VideoService(videoRepository);
const channelService = new ChannelService(channelRepository);
const youtubeService = new YoutubeService();
const watchedVideoService = new WatchedVideoService(watchedVideoRepository);
const playlistService = new PlaylistService(playlistRepository);
const playlistVideoService = new PlaylistVideoService(playlistVideoRepository);
const uploadService = new UploadService(
  videoService,
  channelService,
  youtubeService,
  watchedVideoService,
  playlistService,
  playlistVideoService,
);

const uploadController = new UploadController(uploadService);

router.post("/add-file", uploadController.addFile);
router.post("/upload-file", uploadController.uploadData);

export default router;
