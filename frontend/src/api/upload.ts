import axios from 'axios';

import { DetailedVideo } from '@/types/table/video';
import { DetailedPlaylist } from '@/types/table/playlist';

export async function uploadData(upload: Upload) {
  const response = await axios.post('http://localhost:3000/api/upload/upload-file', { upload });
  console.log(response.data);

  return response.data;
}

export async function addFile(
  upload: Upload
): Promise<{ message: string; data: { history: DetailedVideo[]; playlists: DetailedPlaylist[] } }> {
  const response = await axios.post('http://localhost:3000/api/upload/add-file', { upload });
  console.log(response.data);

  return response.data;
}

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
