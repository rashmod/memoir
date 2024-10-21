import WatchedVideoService from "@/services/watched-videos";

export default class HistoryService {
  constructor(private readonly watchedVideoService: WatchedVideoService) {}

  async getVideoHistory(userId: string, videoId: string) {
    return await this.watchedVideoService.get(userId, videoId);
  }
}
