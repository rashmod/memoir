import { PlaylistRepository } from "@/repositories";
import { insertPlaylist } from "@/types";

export default class PlaylistService {
  constructor(private readonly playlistRepository: PlaylistRepository) {}

  async create(data: insertPlaylist) {
    const playlist = await this.playlistRepository.create(data);
    if (!playlist) throw new Error("Failed to create playlist");

    return playlist;
  }
}
