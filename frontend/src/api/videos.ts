import axios from 'axios';

async function getVideosData(parts: string, ids: string) {
  const response = await axios(
    `https://youtube.googleapis.com/youtube/v3/videos?${parts}&${ids}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
  );

  console.log(response.data);

  return response.data;
}

export default { getVideosData };
