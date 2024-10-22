import { uploadedData } from '@/routes/upload';

export default function getUniqueVideos(data: uploadedData): BasicUniqueVideo[] | DetailedUniqueVideo[] {
  if (data.key === 'detailed') {
    const videos = new Map<string, DetailedUniqueVideo>();

    for (const video of data.history) {
      videos.set(video.videoId, {
        videoId: video.videoId,
        title: video.title,
        url: video.url,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        youtubeCreatedAt: video.youtubeCreatedAt,
        channelId: video.channelId,
        channelName: video.channelName,
        channelUrl: video.channelUrl,
        channelAvatarUrl: video.channelAvatarUrl,
      });
    }

    for (const playlist of data.playlists) {
      for (const video of playlist.videos) {
        videos.set(video.videoId, {
          videoId: video.videoId,
          title: video.title,
          url: video.url,
          thumbnailUrl: video.thumbnailUrl,
          duration: video.duration,
          youtubeCreatedAt: video.youtubeCreatedAt,
          channelId: video.channelId,
          channelName: video.channelName,
          channelUrl: video.channelUrl,
          channelAvatarUrl: video.channelAvatarUrl,
        });
      }
    }

    return Array.from(videos.values());
  }

  const videos = new Map<string, BasicUniqueVideo>();

  for (const video of data.history) {
    videos.set(video.videoId, {
      videoId: video.videoId,
      title: video.title,
      url: video.url,
      channelName: video.channelName,
      channelUrl: video.channelUrl,
    });
  }

  for (const playlist of data.playlists) {
    for (const video of playlist.videos) {
      videos.set(video.videoId, { videoId: video.videoId, url: `https://youtube.com/watch?v=${video.videoId}` });
    }
  }

  return Array.from(videos.values());
}

export type BasicUniqueVideo = {
  videoId: string;
  url: string;
  title?: string;
  channelName?: string;
  channelUrl?: string;
};

export type DetailedUniqueVideo = {
  videoId: string;
  url: string;
  title: string;
  thumbnailUrl: string;
  duration: number;
  youtubeCreatedAt: string;
  channelId: string;
  channelName: string;
  channelUrl: string;
  channelAvatarUrl: string;
};
