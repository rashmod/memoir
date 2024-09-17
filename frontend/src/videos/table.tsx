import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/custom/data-table';
import columns from '@/videos/columns';
import videosApi from '@/api/videos';
import { VideosSchema } from '@/routes/upload';

const parts = ['id', 'snippet', 'contentDetails'].map((item) => 'part=' + item).join('&');

export default function Table({ videos }: { videos: VideosSchema }) {
  const ids = videos.map((item) => 'id=' + item.id).join('&');

  const { data = [], isSuccess } = useQuery({
    queryKey: ['videos'],
    queryFn: () => videosApi.getVideosData(parts, ids),
    enabled: videos.length > 0,

    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const combinedData = useMemo(() => {
    if (isSuccess) {
      return combineData(data, videos);
    }

    return videos;
  }, [isSuccess, videos, data]);

  console.log(Object.keys(videos[0]));
  console.log(Object.keys(combinedData[0]));

  return <DataTable data={combinedData} columns={columns} />;
}

function combineData(data: any[], jsonData: VideosSchema) {
  return jsonData
    .map((item) => {
      const video = data.items.find((video) => video.id === item.id);
      if (!video) return null;

      return {
        id: item.id,
        title: video.snippet.title,
        url: item.url,
        time: item.time,
        channelTitle: video.snippet.channelTitle,
        channelUrl: `https://youtube.com/channel/${video.snippet.channelId}`,
        thumbnail: video.snippet.thumbnails.standard.url,
        duration: video.contentDetails.duration,
      };
    })
    .filter((item) => !!item);
}
