import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Calendar, Clock, ExternalLink, Hourglass, Tally5, Timer } from 'lucide-react';

import videoApi from '@/api/videos';
import { DataTable } from '@/components/custom/data-table';

import formatDate from '@/lib/format-date';
import formatDuration from '@/lib/format-duration';
import { Badge } from '@/components/ui/badge';
import { userVideoHistoryColumns, userVideoPlaylistColumns } from '@/columns/user-video-details';
import NewTabLink from '@/components/custom/new-tab-link';
import LazyImage from '@/components/custom/lazy-image';

export const Route = createFileRoute('/videos/$id')({
  component: Page,
});

// TODO handle videos not watched case

function Page() {
  const { id } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['user-video', id],
    queryFn: () => videoApi.getUserVideo(id),
  });

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>No data</div>;

  const { video, history, playlists } = data.data;

  const youtubeCreatedAt = formatDate(video.youtubeCreatedAt);
  const lastWatchedAt = history.length === 0 ? null : formatDate(history[0]!.watchedAt);

  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-3 space-y-4 [&>*]:space-y-1">
        <div>
          <LazyImage src={video.thumbnailUrl} className="aspect-video w-full bg-black object-contain" />
          <h1 className="text-2xl font-semibold">
            <span>{video.title}</span>
            <NewTabLink link={video.url} className="ml-2">
              <Badge variant="default">
                Go to video <ExternalLink className="ml-1 size-4" />
              </Badge>
            </NewTabLink>
          </h1>
        </div>

        <div>
          <p className="text-lg font-semibold">Description</p>
          <div className="whitespace-pre-line">{video.description || 'No description provided'}</div>
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
          <DataTable data={playlists} columns={userVideoPlaylistColumns} />
        </div>
      </div>

      <div className="col-span-2 space-y-8">
        <div className="flex items-center gap-2">
          <LazyImage src={video.channelAvatarUrl} className="aspect-square w-14 rounded-full object-cover" />
          <div>
            <div className="text-xl font-semibold">
              <span>{video.channelName}</span>
              <NewTabLink link={video.channelUrl} className="ml-2">
                <Badge variant="default">
                  Go to channel <ExternalLink className="ml-1 size-4" />
                </Badge>
              </NewTabLink>
            </div>
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
              <p>{lastWatchedAt ? `${lastWatchedAt.date} at ${lastWatchedAt.time}` : 'Never'}</p>
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

        <div>
          <p className="mb-1 text-lg font-semibold">Watch History</p>
          <DataTable data={history} columns={userVideoHistoryColumns} />
        </div>
      </div>
    </div>
  );
}
