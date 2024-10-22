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

export default { getUserVideos, getUserVideo };
