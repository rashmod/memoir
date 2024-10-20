import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import NewTabLink from '@/components/custom/new-tab-link';
import LazyImage from '@/components/custom/lazy-image';

import formatDuration from '@/lib/format-duration';
import formatDate from '@/lib/format-date';

import { BasicPlaylistVideo, DetailedPlaylistVideo } from '@/types/table/playlist';

const basicPlaylistColumnHelper = createColumnHelper<BasicPlaylistVideo>();
const detailedPlaylistColumnHelper = createColumnHelper<DetailedPlaylistVideo>();

export const basicPlaylistColumns = [
  basicPlaylistColumnHelper.display({
    id: 'select',
    header: () => <Checkbox disabled aria-label="Select all" />,
    cell: () => <Checkbox disabled aria-label="Select row" />,
  }),
  basicPlaylistColumnHelper.display({
    header: 'index',
    cell: ({ cell }) => cell.row.index + 1,
  }),
  basicPlaylistColumnHelper.display({
    header: 'Thumbnail',
    cell: () => <Skeleton className="aspect-video h-20" />,
  }),
  basicPlaylistColumnHelper.display({
    header: 'Title',
    cell: () => <Skeleton className="h-4 w-32" />,
  }),
  basicPlaylistColumnHelper.display({
    header: 'Duration',
    cell: () => <Skeleton className="h-4 w-20" />,
  }),
  basicPlaylistColumnHelper.accessor('addedAt', {
    header: 'Added on',
    cell: ({ cell }) => {
      // TODO show relative time??
      const value = cell.getValue();
      const { date, time } = formatDate(value);

      return (
        <div className="min-w-20">
          <div>{date}</div>
          <div className="text-muted-foreground">{time}</div>
        </div>
      );
    },
  }),
  basicPlaylistColumnHelper.display({
    header: 'Channel Name',
    cell: () => <Skeleton className="h-4 w-32" />,
  }),
  basicPlaylistColumnHelper.display({
    header: 'Channel Avatar',
    cell: () => <Skeleton className="aspect-square h-16 rounded-full" />,
  }),
] as ColumnDef<BasicPlaylistVideo>[];

export const detailedPlaylistColumns = [
  detailedPlaylistColumnHelper.display({
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
  detailedPlaylistColumnHelper.display({
    header: 'index',
    cell: ({ cell }) => cell.row.index + 1,
  }),
  detailedPlaylistColumnHelper.accessor('thumbnailUrl', {
    header: 'Thumbnail',
    cell: ({ cell, row }) => (
      <NewTabLink link={row.original.url} className="block aspect-video h-20">
        <LazyImage src={cell.getValue()} className="aspect-video h-20 object-cover" />
      </NewTabLink>
    ),
  }),
  detailedPlaylistColumnHelper.accessor('title', {
    header: 'Title',
    cell: ({ cell, row }) => <NewTabLink link={row.original.url}>{cell.getValue()}</NewTabLink>,
  }),
  detailedPlaylistColumnHelper.accessor('duration', {
    header: 'Duration',
    cell: ({ cell }) => formatDuration(cell.getValue()),
  }),
  detailedPlaylistColumnHelper.accessor('addedAt', {
    header: 'Added on',
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
  detailedPlaylistColumnHelper.accessor('channelName', {
    header: 'Channel Name',
    cell: ({ cell, row }) => <NewTabLink link={row.original.channelUrl}>{cell.getValue()}</NewTabLink>,
  }),
  detailedPlaylistColumnHelper.accessor('channelAvatarUrl', {
    header: 'Channel Avatar',
    cell: ({ cell, row }) => (
      <NewTabLink link={row.original.channelUrl}>
        <LazyImage src={cell.getValue()} className="aspect-square h-16 rounded-full" />
      </NewTabLink>
    ),
  }),
  {
    accessorKey: 'tags',
    header: 'Tags',
  },
] as ColumnDef<DetailedPlaylistVideo>[];
