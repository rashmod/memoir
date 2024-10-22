import { PlaylistRepository } from "@/repositories";
import { insertPlaylist, insertPlaylistVideo } from "@/types";

export default class PlaylistService {
  constructor(private readonly playlistRepository: PlaylistRepository) {}

  async createPlaylist(data: insertPlaylist) {
    const playlist = await this.playlistRepository.createPlaylist(data);
    if (!playlist) throw new Error("Failed to create playlist");

    return playlist;
  }

  async addVideos(videos: insertPlaylistVideo[]) {
    return await this.playlistRepository.addVideos(videos);
  }

  async bulkAddVideos(videos: insertPlaylistVideo[][]) {
    return await Promise.all(videos.map((chunk) => this.addVideos(chunk)));
  }

  async getExistingPlaylistIds(ids: string[]) {
    const playlists = await this.playlistRepository.getExistingPlaylistIds(ids);

    const existingIds = new Set(playlists.map((playlist) => playlist.id));

    return existingIds;
  }

  async getPlaylistVideoIds(playlistId: string) {
    const videos =
      await this.playlistRepository.getPlaylistVideoIds(playlistId);

    const existingIds = new Set(videos.map((video) => video.id));

    return existingIds;
  }
}
