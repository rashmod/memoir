import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Calendar, Clock, Hourglass, Tally5, Timer } from 'lucide-react';

import videoApi from '@/api/videos';
import { videoTableColumns } from '@/videos/columns';
import { DataTable } from '@/components/custom/data-table';

import formatDate from '@/lib/format-date';
import formatDuration from '@/lib/format-duration';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/video/$id')({
  component: Page,
});

// TODO handle videos not watched case

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
      <div className="col-span-3 space-y-4 [&>*]:space-y-1">
        <div>
          <img src={video.thumbnailUrl} className="aspect-video w-full bg-black object-contain" />
          <h1 className="text-2xl font-semibold">{video.title}</h1>
        </div>

        <div>
          <p className="text-lg font-semibold">Description</p>
          <p>{video.description || 'No description provided'}</p>
        </div>

        <div>
          <p className="text-lg font-semibold">Notes</p>
          <p>No notes provided</p>
          {/* <p>{video.notes || 'No notes provided'}</p> */}
        </div>

        <div>
          <p className="text-lg font-semibold">Tags</p>
          <Badge>Watch count: {history.length}</Badge>
        </div>

        <div>
          <p className="text-lg font-semibold">Playlists</p>
          <p>No playlists</p>
        </div>
      </div>

      <div className="col-span-2 space-y-8">
        <div className="flex items-center gap-2">
          <img src={video.channelAvatarUrl} className="aspect-square w-14 rounded-full object-cover" />
          <div>
            <p className="text-xl font-semibold">{video.channelName}</p>
            <p className="text-sm">since {formatDate(video.channelCreatedAt).date}</p>
          </div>
        </div>

        <div className="space-y-4">
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

        <DataTable data={history} columns={videoTableColumns} />
      </div>
    </div>
  );
}
