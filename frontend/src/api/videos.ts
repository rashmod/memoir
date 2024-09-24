import axios from 'axios';

import { VideosSchema } from '@/routes/upload';

async function getVideosData(parts: string, ids: string) {
  const response = await axios.get(
    `https://youtube.googleapis.com/youtube/v3/videos?${parts}&${ids}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
  );

  console.log(response.data);

  return response.data;
}

async function uploadHistory(history: VideosSchema) {
  const response = await axios.post('http://localhost:3000/api/upload-history', { history });

  console.log(response.data);

  return response.data;
}

export default { getVideosData, uploadHistory };
