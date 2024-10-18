import axios from 'axios';

import { BasicVideo, DetailedVideo, FinalVideo } from '@/types/video';

async function getHistory(): Promise<{ message: string; data: FinalVideo[] }> {
  const response = await axios.get('http://localhost:3000/api/history');
  console.log(response.data);

  return response.data;
}

async function addFile(history: BasicVideo[]): Promise<{ message: string; data: DetailedVideo[] }> {
  const response = await axios.post('http://localhost:3000/api/history/add-file', { history });
  console.log(response.data);

  return response.data;
}

async function uploadHistory(history: BasicVideo[]) {
  const response = await axios.post('http://localhost:3000/api/history/upload-history', { history });
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

export default { uploadHistory, addFile, getHistory, getVideoHistory };
