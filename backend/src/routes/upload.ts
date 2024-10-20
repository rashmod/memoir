import express from "express";

import { UploadController } from "@/controllers";
import {
  UploadService,
  YoutubeService,
  VideoService,
  ChannelService,
} from "@/services";
import { VideoRepository, ChannelRepository } from "@/repositories";

const router = express.Router();

// TODO what is the response if a channel is deleted from youtube
// TODO what should be done to video if a channel is deleted from youtube

const videoRepository = new VideoRepository();
const channelRepository = new ChannelRepository();

const videoService = new VideoService(videoRepository);
const channelService = new ChannelService(channelRepository);
const youtubeService = new YoutubeService();
const uploadService = new UploadService(
  videoService,
  channelService,
  youtubeService,
);

const uploadController = new UploadController(uploadService);

router.post("/add-file", uploadController.addFile);

export default router;
