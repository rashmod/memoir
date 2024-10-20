import express from "express";

import UploadService from "@/services/upload";

export default class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  addFile = async (req: express.Request, res: express.Response) => {
    const { upload }: { upload: Upload } = req.body;

    const response = await this.uploadService.processUpload(upload);

    res.status(200).json({ message: "ok", data: response });
  };
}

export type Upload = {
  history: { videoId: string; watchedAt: string }[];
  playlists: { videoId: string; addedAt: string }[][];
};
