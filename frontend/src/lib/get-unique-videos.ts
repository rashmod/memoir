import { uploadedData } from '@/routes/upload';

export default function getUniqueVideos(data: uploadedData) {
  const history = data.history;
  const playlists = data.playlists.flatMap((item) => item.videos);

  const videos = new Map<string, { id: string }>();

  for (const video of history) {
    videos.set(video.videoId, { id: video.videoId });
  }

  for (const video of playlists) {
    videos.set(video.videoId, { id: video.videoId });
  }

  return Array.from(videos.values());
}
