import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Calendar, Clock, Hourglass, Tally5, Timer } from 'lucide-react';

import videoApi from '@/api/videos';
import { videoTableColumns } from '@/videos/columns';
import { DataTable } from '@/components/custom/data-table';

import formatDate from '@/lib/format-date';
import formatDuration from '@/lib/format-duration';

export const Route = createFileRoute('/video/$id')({
  component: Page,
});

function Page() {
  const { id } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['video', id],
    queryFn: () => videoApi.getVideoHistory(id),
  });

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>No data</div>;

  const { video, history } = data.data;

  const youtubeCreatedAt = formatDate(video.youtubeCreatedAt);
  const lastWatchedAt = formatDate(history[0]!.youtubeCreatedAt);

  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-3 space-y-2">
        <img src={video.thumbnailUrl} className="aspect-video w-full bg-black object-contain" />
        <h1 className="text-2xl font-semibold">{video.title}</h1>
      </div>

      <div className="col-span-2 flex flex-col gap-2">
        <div className="mb-4 flex items-center gap-x-2">
          <img src={video.channelAvatarUrl} className="aspect-square w-14 rounded-full object-cover" />
          <div>
            <p className="text-xl font-semibold">{video.channelName}</p>
            <p className="text-sm">since {formatDate(video.channelCreatedAt).date}</p>
          </div>
        </div>

        <div className="flex items-center gap-x-4 rounded-md border-2 px-6 py-2">
          <Calendar className="size-6" />
          <div>
            <p className="font-medium">Uploaded</p>
            <p>
              {youtubeCreatedAt.date} at {youtubeCreatedAt.time}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-x-4 rounded-md border-2 px-6 py-2">
          <Hourglass className="size-6" />
          <div>
            <p className="font-medium">Duration</p>
            <p>{formatDuration(video.duration)}</p>
          </div>
        </div>

        <div className="flex items-center gap-x-4 rounded-md border-2 px-6 py-2">
          <Tally5 className="size-6" />
          <div>
            <p className="font-medium">Watch Count</p>
            <p>{history.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-x-4 rounded-md border-2 px-6 py-2">
          <Clock className="size-6" />
          <div>
            <p className="font-medium">Last Watched</p>
            <p>
              {lastWatchedAt.date} at {lastWatchedAt.time}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-x-4 rounded-md border-2 px-6 py-2">
          <Timer className="size-6" />
          <div>
            <p className="font-medium">Total Watch Time</p>
            <p>{formatDuration(video.duration * history.length)}</p>
          </div>
        </div>
      </div>

      <div className="col-span-3">
        <p className="text-lg font-semibold">Description</p>
        <p>{video.description || 'No description provided'}</p>
      </div>

      <div className="col-span-2">
        <DataTable data={history} columns={videoTableColumns} />
      </div>
    </div>
  );
}
