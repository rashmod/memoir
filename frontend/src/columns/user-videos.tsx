import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import NewTabLink from '@/components/custom/new-tab-link';
import LazyImage from '@/components/custom/lazy-image';

import formatDuration from '@/lib/format-duration';
import formatDate from '@/lib/format-date';
import { cn } from '@/lib/utils';

import { UserVideo } from '@/types/table/video';

const userVideoTableColumnHelper = createColumnHelper<UserVideo>();

export const loadingUserVideoTableColumns = [
  userVideoTableColumnHelper.display({
    header: 'index',
    cell: ({ cell }) => cell.row.index + 1,
  }),
  userVideoTableColumnHelper.display({
    header: 'Thumbnail',
    cell: () => <Skeleton className="aspect-video h-20" />,
  }),
  userVideoTableColumnHelper.display({
    header: 'Title',
    cell: () => <Skeleton className="h-4 w-64" />,
  }),
  userVideoTableColumnHelper.display({
    header: 'Duration',
    cell: () => <Skeleton className="h-4 w-20" />,
  }),
  userVideoTableColumnHelper.display({
    header: 'Last Watched on',
    cell: () => (
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-10" />
      </div>
    ),
  }),
  userVideoTableColumnHelper.display({
    header: 'Channel Name',
    cell: () => <Skeleton className="h-4 w-32" />,
  }),
  userVideoTableColumnHelper.display({
    header: 'Channel Avatar',
    cell: () => <Skeleton className="aspect-square h-16 rounded-full" />,
  }),
  userVideoTableColumnHelper.display({
    header: 'Tags',
    cell: () => (
      <div className="flex min-w-32 flex-wrap gap-2">
        {Array(5)
          .fill(0)
          .map((_, i) => {
            const rand = Math.floor(Math.random() * 10);

            return (
              <Skeleton
                key={i}
                className={cn('h-4 rounded-full', {
                  'w-10': rand % 3 === 0,
                  'w-14': rand % 3 === 1,
                  'w-16': rand % 3 === 2,
                })}
              />
            );
          })}
      </div>
    ),
  }),
] as ColumnDef<null>[];

export const userVideoTableColumns = [
  // displayTableColumnHelper.display({
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // }),
  userVideoTableColumnHelper.display({
    header: 'index',
    cell: ({ cell }) => cell.row.index + 1,
  }),
  userVideoTableColumnHelper.accessor('thumbnailUrl', {
    header: 'Thumbnail',
    cell: ({ cell, row }) => {
      const value = cell.getValue();

      return (
        <NewTabLink link={row.original.url} className="block aspect-video h-20">
          <LazyImage src={value} className="aspect-video h-20 bg-black object-contain" />
        </NewTabLink>
      );
    },
  }),
  userVideoTableColumnHelper.accessor('title', {
    header: 'Title',
    cell: ({ cell, row }) => {
      const value = cell.getValue();

      return <NewTabLink link={row.original.url}>{value}</NewTabLink>;
    },
  }),
  userVideoTableColumnHelper.accessor('duration', {
    header: 'Duration',
    cell: ({ cell }) => {
      const value = cell.getValue();

      return formatDuration(value);
    },
  }),
  userVideoTableColumnHelper.accessor('lastWatchedAt', {
    header: 'Last Watched on',
    cell: ({ cell }) => {
      // TODO show relative time??
      const value = cell.getValue();

      if (!value) {
        return null;
      }

      const { date, time } = formatDate(value);

      return (
        <div className="min-w-28">
          <div>{date}</div>
          <div className="text-muted-foreground">{time}</div>
        </div>
      );
    },
  }),
  userVideoTableColumnHelper.accessor('channelName', {
    header: 'Channel Name',
    cell: ({ cell, row }) => {
      const value = cell.getValue();

      return <NewTabLink link={row.original.channelUrl}>{value}</NewTabLink>;
    },
  }),
  userVideoTableColumnHelper.accessor('channelAvatarUrl', {
    header: 'Channel Avatar',
    cell: ({ cell, row }) => {
      const value = cell.getValue();
      return (
        <NewTabLink link={row.original.channelUrl}>
          <LazyImage src={value} className="aspect-square h-16 rounded-full" />
        </NewTabLink>
      );
    },
  }),
  userVideoTableColumnHelper.display({
    header: 'Tags',
    cell: ({ row }) => {
      // TODO handle videos not watched case
      const watchCount = row.original.watchCount ?? 0;
      const playlists = row.original.playlists;

      return (
        <div className="flex flex-wrap gap-1">
          <Badge className="text-nowrap">Watch count: {watchCount}</Badge>
          {playlists.map((playlist, i) => (
            <Badge className="text-nowrap" key={`${playlist}-${i}`}>
              Playlist: {playlist}
            </Badge>
          ))}
        </div>
      );
    },
  }),
] as ColumnDef<UserVideo>[];
