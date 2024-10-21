import axios from 'axios';

import { DetailedVideoNew, FinalVideo } from '@/types/table/video';
import { DetailedPlaylist } from '@/types/table/playlist';

async function getHistory(): Promise<{ message: string; data: FinalVideo[] }> {
  const response = await axios.get('http://localhost:3000/api/history');
  console.log(response.data);

  return response.data;
}

async function uploadData(upload: Upload) {
  const response = await axios.post('http://localhost:3000/api/upload/upload-file', { upload });
  console.log(response.data);

  return response.data;
}

async function addFile(
  upload: Upload
): Promise<{ message: string; data: { history: DetailedVideoNew[]; playlists: DetailedPlaylist[] } }> {
  const response = await axios.post('http://localhost:3000/api/upload/add-file', { upload });
  console.log(response.data);

  return response.data;
}

async function getVideoHistory(videoId: string): Promise<{
  message: string;
  data: {
    video: {
      videoId: string;
      title: string;
      description: string | null;
      url: string;
      thumbnailUrl: string;
      duration: number;
      youtubeCreatedAt: string;
      channelId: string;
      channelName: string;
      channelUrl: string;
      channelAvatarUrl: string;
      channelCreatedAt: string;
    };
    history: {
      id: string;
      youtubeCreatedAt: string;
      createdAt: string;
      updatedAt: string;
      userId: string;
      youtubeVideoId: string;
    }[];
  };
}> {
  const response = await axios.get(`http://localhost:3000/api/history/${videoId}`);
  console.log(response.data);

  return response.data;
}

export default { uploadData, addFile, getHistory, getVideoHistory };

type Upload = {
  history: { videoId: string; watchedAt: string }[];
  playlists: {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    visibility: string;
    videos: { videoId: string; addedAt: string }[];
  }[];
};
