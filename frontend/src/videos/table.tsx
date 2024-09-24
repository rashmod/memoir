import { useQuery } from '@tanstack/react-query';
import { RowSelectionState } from '@tanstack/react-table';

import videosApi from '@/api/videos';
import { DataTable } from '@/components/custom/data-table';
import { VideosSchema } from '@/routes/upload';
import columns from '@/videos/columns';
import parseISODuration from '@/lib/parse-iso-duration';

const parts = ['id', 'snippet', 'contentDetails'].map((item) => 'part=' + item).join('&');

export default function Table({
  videos,
  rowSelection,
  setRowSelection,
}: {
  videos: VideosSchema;
  rowSelection?: RowSelectionState;
  setRowSelection?: (value: RowSelectionState | ((prevState: RowSelectionState) => RowSelectionState)) => void;
}) {
  const ids = videos.map((item) => 'id=' + item.youtubeId).join('&');

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

  return (
    <DataTable
      data={combinedData}
      columns={columns}
      getId={(item) => item.youtubeId}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
    />
  );
}

function combineData(data: any[], jsonData: VideosSchema) {
  return jsonData
    .map((item) => {
      const video = data.items.find((video) => video.id === item.youtubeId);
      if (!video) return null;

      const result = {
        youtubeId: item.youtubeId,
        title: video.snippet.title as string,
        url: item.url,
        time: item.time,
        channelId: video.snippet.channelId as string,
        channelTitle: video.snippet.channelTitle as string,
        channelUrl: `https://youtube.com/channel/${video.snippet.channelId}`,
        thumbnail: video.snippet.thumbnails.standard.url as string,
        duration: parseISODuration(video.contentDetails.duration as string),
        youtubeCreatedAt: new Date(video.snippet.publishedAt),
      };
      return result;
    })
    .filter((item) => !!item);
}
