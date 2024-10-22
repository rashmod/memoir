import express from "express";

import UploadService from "@/services/upload";

export default class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  addFile = async (req: express.Request, res: express.Response) => {
    const { upload }: { upload: Upload } = req.body;

    const response = await this.uploadService.processUpload(upload);

    res.status(200).json({ message: "ok", data: response });
  };

  uploadData = async (req: express.Request, res: express.Response) => {
    const { upload }: { upload: Upload } = req.body;

    const userId = "0e4fce12-3606-4a66-b545-17b219682451";

    const response = await this.uploadService.uploadData(upload, userId);

    res.status(200).json({ message: "ok", response });
  };
}

export type Upload = {
  userId: string;
  history: { videoId: string; watchedAt: string }[];
  playlists: {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    visibility: string;
    videos: { videoId: string; addedAt: string }[];
  }[];
};
