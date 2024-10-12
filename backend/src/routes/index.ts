import express from "express";

import history from "@/routes/history";

const router = express.Router();

router.use("/history", history);

export default router;
