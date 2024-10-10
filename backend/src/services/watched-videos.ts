import { watchedVideo } from "@/db/schema";
import WatchedVideoRepository from "@/repositories/watchedVideo";

export default class WatchedVideoService {
  constructor(private readonly watchedVideoRepository: WatchedVideoRepository) {
    this.watchedVideoRepository = watchedVideoRepository;
  }

  async bulkCreate(videos: (typeof watchedVideo.$inferInsert)[][]) {
    return await Promise.all(videos.map((chunk) => this.create(chunk)));
  }

  async create(videos: (typeof watchedVideo.$inferInsert)[]) {
    return await this.watchedVideoRepository.create(videos);
  }

  async getAll(userId: string) {
    return await this.watchedVideoRepository.getAll(userId);
  }
}
