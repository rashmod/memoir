import { video } from "@/db/schema";
import chunkArray from "@/lib/chunk-array";
import VideoRepository from "@/repositories/video";

export default class VideoService {
  videoRepository: VideoRepository;

  constructor(videoRepository: VideoRepository) {
    this.videoRepository = videoRepository;
  }

  async bulkCreate(videos: (typeof video.$inferInsert)[][]) {
    return await Promise.all(videos.map((chunk) => this.create(chunk)));
  }

  async create(videos: (typeof video.$inferInsert)[]) {
    return await this.videoRepository.create(videos);
  }

  async getMissingVideoIds(videoIdSet: Set<string>, chunkSize: number) {
    const chunks = chunkArray(Array.from(videoIdSet), chunkSize);
    const existingVideoIds = await Promise.all(
      chunks.map((ids) => this.videoRepository.getExisting(ids)),
    );

    for (const ids of existingVideoIds) {
      for (const id of ids) {
        videoIdSet.delete(id.youtubeId);
      }
    }

    return Array.from(videoIdSet);
  }
}
