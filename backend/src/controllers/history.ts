import express from "express";

import { VideoService, HistoryService } from "@/services";

export default class HistoryController {
  constructor(
    private readonly historyService: HistoryService,
    private readonly videoService: VideoService,
  ) {}

  getVideoHistory = async (req: express.Request, res: express.Response) => {
    const { videoId } = req.params;
    const userId = "0e4fce12-3606-4a66-b545-17b219682451";

    if (!videoId) throw new Error("No videoId provided");

    const video = await this.videoService.get(videoId);
    const videoHistory = await this.historyService.getVideoHistory(
      userId,
      videoId,
    );

    res
      .status(200)
      .json({ message: "ok", data: { video, history: videoHistory } });
  };
}

export type HistoryVideo = {
  title: string;
  time: string;
  url: string;
  youtubeId: string;
};
