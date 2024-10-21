import { UserVideoController } from "@/controllers";
import { UserVideoRepository } from "@/repositories";
import { UserVideoService } from "@/services";
import express from "express";

const router = express.Router();

const userVideoRepository = new UserVideoRepository();
const userVideoService = new UserVideoService(userVideoRepository);
const userVideoController = new UserVideoController(userVideoService);

router.get("/", userVideoController.getAll);
router.get("/:videoId", () => {});

export default router;
