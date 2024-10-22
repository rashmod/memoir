import { UserVideoService } from "@/services";
import express from "express";

export default class VideoController {
  constructor(private readonly userVideoService: UserVideoService) {}

  getAll = async (req: express.Request, res: express.Response) => {
    const userId = "0e4fce12-3606-4a66-b545-17b219682451";

    const response = await this.userVideoService.getAll(userId);

    res.status(200).json({ message: "ok", data: response });
  };

  getVideo = async (req: express.Request, res: express.Response) => {
    const { videoId } = req.params;
    const userId = "0e4fce12-3606-4a66-b545-17b219682451";

    if (!videoId) throw new Error("No videoId provided");

    const response = await this.userVideoService.getVideo(userId, videoId);

    res.status(200).json({ message: "ok", data: response });
  };
}
