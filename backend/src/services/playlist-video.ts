import { PlaylistVideoRepository } from "@/repositories";
import { insertPlaylistVideo } from "@/types";

export default class PlaylistVideoService {
  constructor(
    private readonly playlistVideoRepository: PlaylistVideoRepository,
  ) {
    this.playlistVideoRepository = playlistVideoRepository;
  }

  async bulkCreate(videos: insertPlaylistVideo[][]) {
    return await Promise.all(videos.map((chunk) => this.create(chunk)));
  }

  async create(videos: insertPlaylistVideo[]) {
    return await this.playlistVideoRepository.create(videos);
  }
}
