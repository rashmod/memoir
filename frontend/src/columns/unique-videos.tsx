import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import NewTabLink from '@/components/custom/new-tab-link';

import { cn } from '@/lib/utils';
import { BasicUniqueVideo, DetailedUniqueVideo } from '@/lib/get-unique-videos';
import LazyImage from '@/components/custom/lazy-image';
import formatDuration from '@/lib/format-duration';
import formatDate from '@/lib/format-date';

const basicUniqueVideoColumnHelper = createColumnHelper<BasicUniqueVideo>();
const detailedUniqueVideoColumnHelper = createColumnHelper<DetailedUniqueVideo>();

export const basicUniqueVideoColumns = [
  basicUniqueVideoColumnHelper.display({
    id: 'select',
    header: () => <Checkbox disabled aria-label="Select all" />,
    cell: () => <Checkbox disabled aria-label="Select row" />,
  }),
  basicUniqueVideoColumnHelper.display({
    header: 'index',
    cell: ({ cell }) => cell.row.index + 1,
  }),
  basicUniqueVideoColumnHelper.display({
    header: 'Thumbnail',
    cell: ({ row }) => (
      <NewTabLink link={row.original.url}>
        <Skeleton className="aspect-video h-20" />
      </NewTabLink>
    ),
  }),
  basicUniqueVideoColumnHelper.accessor('title', {
    header: 'Title',
    cell: ({ row, cell }) => {
      const title = cell.getValue();

      return <NewTabLink link={row.original.url}>{title || <Skeleton className="h-4 w-32" />}</NewTabLink>;
    },
  }),
  basicUniqueVideoColumnHelper.display({
    header: 'Duration',
    cell: () => <Skeleton className="h-4 w-20" />,
  }),
  basicUniqueVideoColumnHelper.display({
    header: 'Uploaded on',
    cell: () => (
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-10" />
      </div>
    ),
  }),
  basicUniqueVideoColumnHelper.accessor('channelName', {
    header: 'Channel Name',
    cell: ({ cell, row }) => {
      const channelName = cell.getValue();

      return channelName ? (
        <NewTabLink link={row.original.channelUrl}>{cell.getValue()}</NewTabLink>
      ) : (
        <Skeleton className="h-4 w-32" />
      );
    },
  }),
  basicUniqueVideoColumnHelper.display({
    header: 'Channel Avatar',
    cell: ({ row }) => {
      const channelName = row.original.channelName;

      return channelName ? (
        <NewTabLink link={row.original.channelUrl}>
          <Skeleton className="aspect-square h-16 rounded-full" />
        </NewTabLink>
      ) : (
        <Skeleton className="aspect-square h-16 rounded-full" />
      );
    },
  }),
  basicUniqueVideoColumnHelper.display({
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
] as ColumnDef<BasicUniqueVideo>[];

export const detailedUniqueVideoColumns = [
  detailedUniqueVideoColumnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  detailedUniqueVideoColumnHelper.display({
    header: 'index',
    cell: ({ cell }) => cell.row.index + 1,
  }),
  detailedUniqueVideoColumnHelper.accessor('thumbnailUrl', {
    header: 'Thumbnail',
    cell: ({ cell, row }) => (
      <NewTabLink link={row.original.url} className="block aspect-video h-20">
        <LazyImage src={cell.getValue()} className="aspect-video h-20 object-cover" />
      </NewTabLink>
    ),
  }),
  detailedUniqueVideoColumnHelper.accessor('title', {
    header: 'Title',
    cell: ({ cell, row }) => <NewTabLink link={row.original.url}>{cell.getValue()}</NewTabLink>,
  }),
  detailedUniqueVideoColumnHelper.accessor('duration', {
    header: 'Duration',
    cell: ({ cell }) => formatDuration(cell.getValue()),
  }),
  detailedUniqueVideoColumnHelper.accessor('youtubeCreatedAt', {
    header: 'Uploaded on',
    cell: ({ cell }) => {
      // TODO show relative time??
      const { date, time } = formatDate(cell.getValue());

      return (
        <div className="min-w-20">
          <div>{date}</div>
          <div className="text-muted-foreground">{time}</div>
        </div>
      );
    },
  }),
  detailedUniqueVideoColumnHelper.accessor('channelName', {
    header: 'Channel Name',
    cell: ({ cell, row }) => <NewTabLink link={row.original.channelUrl}>{cell.getValue()}</NewTabLink>,
  }),
  detailedUniqueVideoColumnHelper.accessor('channelAvatarUrl', {
    header: 'Channel Avatar',
    cell: ({ cell, row }) => (
      <NewTabLink link={row.original.channelUrl}>
        <LazyImage src={cell.getValue()} className="aspect-square h-16 rounded-full" />
      </NewTabLink>
    ),
  }),
  detailedUniqueVideoColumnHelper.display({
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
] as ColumnDef<DetailedUniqueVideo>[];
