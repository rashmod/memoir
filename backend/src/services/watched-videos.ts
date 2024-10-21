import WatchedVideoRepository from "@/repositories/watchedVideo";
import { insertWatchedVideo } from "@/types";

export default class WatchedVideoService {
  constructor(private readonly watchedVideoRepository: WatchedVideoRepository) {
    this.watchedVideoRepository = watchedVideoRepository;
  }

  async bulkCreate(videos: insertWatchedVideo[][]) {
    return await Promise.all(videos.map((chunk) => this.create(chunk)));
  }

  async create(videos: insertWatchedVideo[]) {
    return await this.watchedVideoRepository.create(videos);
  }

  async get(userId: string, youtubeId: string) {
    return await this.watchedVideoRepository.get(userId, youtubeId);
  }
}
