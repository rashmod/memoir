import express from "express";

import upload from "@/routes/upload";
import userVideo from "@/routes/user-video";

const router = express.Router();

router.use("/upload", upload);
router.use("/videos", userVideo);

export default router;
