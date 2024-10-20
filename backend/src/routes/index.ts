import express from "express";

import history from "@/routes/history";
import upload from "@/routes/upload";

const router = express.Router();

router.use("/history", history);
router.use("/upload", upload);

export default router;
