import express from "express";

import HistoryService from "@/services/history";

export default class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  getHistory = async (req: express.Request, res: express.Response) => {
    const userId = "0e4fce12-3606-4a66-b545-17b219682451";

    const response = await this.historyService.getHistory(userId);

    res.status(200).json({ message: "ok", data: response });
  };

  addFile = async (req: express.Request, res: express.Response) => {
    const { history }: { history: HistoryVideo[] } = req.body;

    const response = await this.historyService.processHistory(history);

    res.status(200).json({ message: "ok", data: response });
  };

  uploadHistory = async (req: express.Request, res: express.Response) => {
    const { history }: { history: HistoryVideo[] } = req.body;

    const userId = "0e4fce12-3606-4a66-b545-17b219682451";

    const response = await this.historyService.uploadHistory(history, userId);

    res.status(200).json({ message: "ok", response });
  };
}

export type HistoryVideo = {
  title: string;
  time: string;
  url: string;
  youtubeId: string;
};
