import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/custom/data-table';
import columns from '@/videos/columns';
import videosApi from '@/api/videos';
import { VideoSchema } from '@/routes/upload';

const parts = ['id', 'snippet', 'contentDetails'].map((item) => 'part=' + item).join('&');

export default function Table({ videos }: { videos: VideoSchema }) {
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
      return videos
        .map((item) => {
          const video = data.items.find((video) => video.id === item.id);
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

    return videos;
  }, [isSuccess, data]);

  console.log(Object.keys(videos[0]));
  console.log(Object.keys(combinedData[0]));

  return <DataTable data={combinedData} columns={columns} />;
}
