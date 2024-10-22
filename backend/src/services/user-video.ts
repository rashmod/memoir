import { UserVideoRepository } from "@/repositories";
import { VideoService } from "@/services";

export default class UserVideoService {
  constructor(
    private readonly userVideoRepository: UserVideoRepository,
    private readonly videoService: VideoService,
  ) {}

  async getAll(userId: string) {
    const history = await this.userVideoRepository.getHistory(userId);
    const playlists = await this.userVideoRepository.getPlaylists(userId);

    const result = new Map<
      string,
      {
        videoId: string;
        title: string;
        url: string;
        lastWatchedAt: Date | null;
        thumbnailUrl: string;
        duration: number;
        youtubeCreatedAt: Date;
        channelId: string;
        channelName: string;
        channelUrl: string;
        channelAvatarUrl: string;
        watchCount: number;
        playlists: string[];
      }
    >();

    for (const video of history) {
      result.set(video.videoId, {
        videoId: video.videoId,
        title: video.title,
        url: video.url,
        lastWatchedAt: video.lastWatchedAt,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        youtubeCreatedAt: video.youtubeCreatedAt,
        channelId: video.channelId,
        channelName: video.channelName,
        channelUrl: video.channelUrl,
        channelAvatarUrl: video.channelAvatarUrl,
        watchCount: video.watchCount,
        playlists: [],
      });
    }

    for (const video of playlists) {
      const data = result.get(video.videoId);
      if (data) {
        result.set(video.videoId, {
          ...data,
          playlists: data.playlists.concat(video.playlistName),
        });
      } else {
        result.set(video.videoId, {
          videoId: video.videoId,
          title: video.title,
          url: video.url,
          lastWatchedAt: null,
          thumbnailUrl: video.thumbnailUrl,
          duration: video.duration,
          youtubeCreatedAt: video.youtubeCreatedAt,
          channelId: video.channelId,
          channelName: video.channelName,
          channelUrl: video.channelUrl,
          channelAvatarUrl: video.channelAvatarUrl,
          watchCount: 0,
          playlists: [video.playlistName],
        });
      }
    }

    return Array.from(result.values());
  }

  async getVideo(userId: string, videoId: string) {
    const video = await this.videoService.get(videoId);
    const history = await this.userVideoRepository.getVideoHistory(
      userId,
      videoId,
    );
    const playlists = await this.userVideoRepository.getVideoPlaylists(
      userId,
      videoId,
    );

    return { video, history, playlists };
  }
}
