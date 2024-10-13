import { video } from "@/db/schema";
import chunkArray from "@/lib/chunk-array";
import VideoRepository from "@/repositories/video";

export default class VideoService {
  constructor(private readonly videoRepository: VideoRepository) {}

  async bulkCreate(videos: (typeof video.$inferInsert)[][]) {
    return await Promise.all(videos.map((chunk) => this.create(chunk)));
  }

  async create(videos: (typeof video.$inferInsert)[]) {
    return await this.videoRepository.create(videos);
  }

  async getMissingVideoIds(videoIdSet: Set<string>, chunkSize: number) {
    const chunks = chunkArray(Array.from(videoIdSet), chunkSize);
    const existingVideos = await Promise.all(
      chunks.map((ids) => this.videoRepository.getExisting(ids)),
    );

    for (const videos of existingVideos) {
      for (const video of videos) {
        videoIdSet.delete(video.youtubeId);
      }
    }

    return [Array.from(videoIdSet), existingVideos] as const;
  }

  async get(videoId: string) {
    const video = await this.videoRepository.get(videoId);
    if (!video) throw new Error("Video not found");

    return video;
  }
}
