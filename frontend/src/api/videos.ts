import axios from 'axios';

import { VideoSchema, VideosSchema } from '@/routes/upload';

async function addFile(
  history: Pick<VideoSchema, 'title' | 'url' | 'time' | 'youtubeId'>[]
): Promise<{ message: string; data: VideosSchema }> {
  const response = await axios.post('http://localhost:3000/api/add-file', { history });

  console.log(response.data);

  return response.data;
}

async function uploadHistory(history: VideosSchema) {
  const response = await axios.post('http://localhost:3000/api/upload-history', { history });

  console.log(response.data);

  return response.data;
}

export default { uploadHistory, addFile };
