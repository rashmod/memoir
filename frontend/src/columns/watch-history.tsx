import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import NewTabLink from '@/components/custom/new-tab-link';
import LazyImage from '@/components/custom/lazy-image';

import formatDuration from '@/lib/format-duration';
import formatDate from '@/lib/format-date';

import { BasicVideoNew, DetailedVideoNew } from '@/types/table/video';

const basicWatchHistoryColumnHelper = createColumnHelper<BasicVideoNew>();
const detailedWatchHistoryColumnHelper = createColumnHelper<DetailedVideoNew>();

export const basicWatchHistoryColumns = [
  basicWatchHistoryColumnHelper.display({
    id: 'select',
    header: () => <Checkbox disabled aria-label="Select all" />,
    cell: () => <Checkbox disabled aria-label="Select row" />,
  }),
  basicWatchHistoryColumnHelper.display({
    header: 'index',
    cell: ({ cell }) => cell.row.index + 1,
  }),
  basicWatchHistoryColumnHelper.display({
    header: 'Thumbnail',
    cell: ({ row }) => (
      <NewTabLink link={row.original.url}>
        <Skeleton className="aspect-video h-20" />
      </NewTabLink>
    ),
  }),
  basicWatchHistoryColumnHelper.accessor('title', {
    header: 'Title',
    cell: ({ cell, row }) => <NewTabLink link={row.original.url}>{cell.getValue()}</NewTabLink>,
  }),
  basicWatchHistoryColumnHelper.display({
    header: 'Duration',
    cell: () => <Skeleton className="h-4 w-20" />,
  }),
  basicWatchHistoryColumnHelper.accessor('watchedAt', {
    header: 'Watched on',
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
  basicWatchHistoryColumnHelper.accessor('channelName', {
    header: 'Channel Name',
    cell: ({ cell, row }) => {
      const value = cell.getValue();

      return (
        <NewTabLink link={row.original.channelUrl}>{value ? value : <Skeleton className="h-4 w-32" />}</NewTabLink>
      );
    },
  }),
  basicWatchHistoryColumnHelper.display({
    header: 'Channel Avatar',
    cell: ({ row }) => (
      <NewTabLink link={row.original.channelUrl}>
        <Skeleton className="aspect-square h-16 rounded-full" />
      </NewTabLink>
    ),
  }),
] as ColumnDef<BasicVideoNew>[];

export const detailedWatchHistoryColumns = [
  detailedWatchHistoryColumnHelper.display({
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
  detailedWatchHistoryColumnHelper.display({
    header: 'index',
    cell: ({ cell }) => cell.row.index + 1,
  }),
  detailedWatchHistoryColumnHelper.accessor('thumbnailUrl', {
    header: 'Thumbnail',
    cell: ({ cell, row }) => (
      <NewTabLink link={row.original.url} className="block aspect-video h-20">
        <LazyImage src={cell.getValue()} className="aspect-video h-20 object-cover" />
      </NewTabLink>
    ),
  }),
  detailedWatchHistoryColumnHelper.accessor('title', {
    header: 'Title',
    cell: ({ cell, row }) => <NewTabLink link={row.original.url}>{cell.getValue()}</NewTabLink>,
  }),
  detailedWatchHistoryColumnHelper.accessor('duration', {
    header: 'Duration',
    cell: ({ cell }) => formatDuration(cell.getValue()),
  }),
  detailedWatchHistoryColumnHelper.accessor('watchedAt', {
    header: 'Watched on',
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
  detailedWatchHistoryColumnHelper.accessor('channelName', {
    header: 'Channel Name',
    cell: ({ cell, row }) => <NewTabLink link={row.original.channelUrl}>{cell.getValue()}</NewTabLink>,
  }),
  detailedWatchHistoryColumnHelper.accessor('channelAvatarUrl', {
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
] as ColumnDef<DetailedVideoNew>[];
