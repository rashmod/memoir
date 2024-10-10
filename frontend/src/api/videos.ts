import axios from 'axios';

import { BasicVideo, MergedVideo } from '@/videos/types';

async function addFile(history: BasicVideo[]): Promise<{ message: string; data: MergedVideo[] }> {
  const response = await axios.post('http://localhost:3000/api/add-file', { history });

  console.log(response.data);

  return response.data;
}

async function uploadHistory(history: MergedVideo[]) {
  const response = await axios.post('http://localhost:3000/api/upload-history', { history });

  console.log(response.data);

  return response.data;
}

export default { uploadHistory, addFile };
