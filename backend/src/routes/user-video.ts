import { UserVideoController } from "@/controllers";
import { UserVideoRepository, VideoRepository } from "@/repositories";
import { UserVideoService, VideoService } from "@/services";
import express from "express";

const router = express.Router();

const videoRepository = new VideoRepository();
const userVideoRepository = new UserVideoRepository();

const videoService = new VideoService(videoRepository);
const userVideoService = new UserVideoService(
  userVideoRepository,
  videoService,
);

const userVideoController = new UserVideoController(userVideoService);

router.get("/", userVideoController.getAll);
router.get("/summary", userVideoController.getSummary);
router.get("/:videoId", userVideoController.getVideo);

export default router;
