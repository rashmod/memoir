import axios from 'axios';

import { UserVideo, UserVideoDetails } from '@/types/table/video';

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

async function getSummary(
  startDate: Date,
  endDate: Date
): Promise<{
  message: string;
  data: {
    historySummary: {
      date: string;
      count: number;
      uniqueCount: number;
      duration: number;
      uniqueDuration: number;
    }[];
    channelSummary: {
      channelId: string;
      channelName: string;
      channelAvatarUrl: string;
      count: number;
      duration: number;
    }[];
    watchLaterSummary: {
      channelId: string;
      channelName: string;
      channelAvatarUrl: string;
      count: number;
      duration: number;
    }[];
  };
}> {
  const response = await axios.get(
    `http://localhost:3000/api/videos/summary?startDate=${startDate}&endDate=${endDate}`
  );
  console.log(response.data);

  return response.data;
}

export default { getUserVideos, getUserVideo, getSummary };
