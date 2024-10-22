import axios from 'axios';

import { DetailedVideo, UserVideo, UserVideoDetails } from '@/types/table/video';
import { DetailedPlaylist } from '@/types/table/playlist';

async function getUserVideos(): Promise<{ message: string; data: UserVideo[] }> {
  const response = await axios.get('http://localhost:3000/api/videos');
  console.log('user videos');
  console.log(response.data);

  return response.data;
}

async function getUserVideo(videoId: string): Promise<{ message: string; data: UserVideoDetails }> {
  const response = await axios.get(`http://localhost:3000/api/videos/${videoId}`);
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
): Promise<{ message: string; data: { history: DetailedVideo[]; playlists: DetailedPlaylist[] } }> {
  const response = await axios.post('http://localhost:3000/api/upload/add-file', { upload });
  console.log(response.data);

  return response.data;
}

export default { uploadData, addFile, getUserVideos, getUserVideo };

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
