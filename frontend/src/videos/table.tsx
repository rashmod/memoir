import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import history from '@/data/watch-history.json';

import { DataTable } from '@/components/custom/data-table';
import columns from '@/videos/columns';

const initialData = (history as any[])
  .slice(0, 50)
  .filter((item) => !item.details)
  .filter((item) => item.titleUrl)
  .map((item) => {
    const subtitles = item.subtitles;

    const channelTitle = subtitles ? subtitles[0].name : undefined;
    const channelUrl = subtitles ? subtitles[0].url : undefined;

    return {
      ...item,
      title: item.title.replace('Watched ', ''),
      url: item.titleUrl,
      channelTitle,
      channelUrl,
    };
  });

const ids = initialData
  .map((item) => {
    const [, url] = item.titleUrl.split('=');
    return 'id=' + url;
  })
  .join('&');

const parts = ['id', 'snippet', 'contentDetails'].map((item) => 'part=' + item).join('&');

export default function Table() {
  const { data = [], isSuccess } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 1000));
      const response = await axios(
        `https://youtube.googleapis.com/youtube/v3/videos?${parts}&${ids}&key=AIzaSyDFofEQXnBEX5pmJA2B3_2RYa660-9YcNk`
      );

      console.log(response.data);

      return response.data;
    },
  });

  const combinedData = useMemo(() => {
    if (isSuccess) {
      return initialData
        .map((item) => {
          const video = data.items.find((video) => video.id === item.titleUrl.split('=')[1]);
          if (!video) return null;

          return {
            ...item,
            channelTitle: video.snippet.channelTitle,
            thumbnail: video.snippet.thumbnails.standard.url,
            title: video.snippet.title,
            duration: video.contentDetails.duration,
          };
        })
        .filter((item) => !!item);
    }

    return initialData;
  }, [isSuccess, data]);

  return <DataTable data={combinedData} columns={columns} />;
}
