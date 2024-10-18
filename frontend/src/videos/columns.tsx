import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import NewTabLink from '@/components/custom/new-tab-link';
import LazyImage from '@/components/custom/lazy-image';

import formatDuration from '@/lib/format-duration';
import formatDate from '@/lib/format-date';

import { FinalVideo, HistoryVideo, BasicVideo, DetailedVideo } from '@/types/table/video';

const basicWatchHistoryColumnHelper = createColumnHelper<BasicVideo>();
const detailedWatchHistoryColumnHelper = createColumnHelper<DetailedVideo>();

const displayTableColumnHelper = createColumnHelper<FinalVideo>();
const videoTableColumnHelper = createColumnHelper<HistoryVideo>();

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
    cell: ({ cell, row }) => {
      const value = cell.getValue();

      return <NewTabLink link={row.original.url}>{value}</NewTabLink>;
    },
  }),
  basicWatchHistoryColumnHelper.display({
    header: 'Duration',
    cell: () => <Skeleton className="h-4 w-20" />,
  }),
  basicWatchHistoryColumnHelper.accessor('time', {
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
] as ColumnDef<BasicVideo>[];

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
    cell: ({ cell, row }) => {
      const value = cell.getValue();

      return (
        <NewTabLink link={row.original.url}>
          {value ? (
            <LazyImage src={value} className="aspect-video h-20 object-cover" />
          ) : (
            <Skeleton className="aspect-video h-20" />
          )}
        </NewTabLink>
      );
    },
  }),
  detailedWatchHistoryColumnHelper.accessor('title', {
    header: 'Title',
    cell: ({ cell, row }) => {
      const value = cell.getValue();

      return <NewTabLink link={row.original.url}>{value}</NewTabLink>;
    },
  }),
  detailedWatchHistoryColumnHelper.accessor('duration', {
    header: 'Duration',
    cell: ({ cell }) => {
      const value = cell.getValue();

      if (!value) return <Skeleton className="h-4 w-20" />;

      return formatDuration(value);
    },
  }),
  detailedWatchHistoryColumnHelper.accessor('time', {
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
  detailedWatchHistoryColumnHelper.accessor('channelName', {
    header: 'Channel Name',
    cell: ({ cell, row }) => {
      const value = cell.getValue();

      return (
        <NewTabLink link={row.original.channelUrl}>{value ? value : <Skeleton className="h-4 w-32" />}</NewTabLink>
      );
    },
  }),
  detailedWatchHistoryColumnHelper.accessor('channelAvatarUrl', {
    header: 'Channel Avatar',
    cell: ({ cell, row }) => {
      const value = cell.getValue();
      return (
        <NewTabLink link={row.original.channelUrl}>
          {value ? (
            <LazyImage src={value} className="aspect-square h-16 rounded-full" />
          ) : (
            <Skeleton className="aspect-square h-16 rounded-full" />
          )}
        </NewTabLink>
      );
    },
  }),
  {
    accessorKey: 'tags',
    header: 'Tags',
  },
] as ColumnDef<BasicVideo>[];

export const displayTableColumns = [
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
  displayTableColumnHelper.display({
    header: 'index',
    cell: ({ cell }) => cell.row.index + 1,
  }),
  displayTableColumnHelper.accessor('thumbnailUrl', {
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
  displayTableColumnHelper.accessor('title', {
    header: 'Title',
    cell: ({ cell, row }) => {
      const value = cell.getValue();

      return <NewTabLink link={row.original.url}>{value}</NewTabLink>;
    },
  }),
  displayTableColumnHelper.accessor('duration', {
    header: 'Duration',
    cell: ({ cell }) => {
      const value = cell.getValue();

      return formatDuration(value);
    },
  }),
  displayTableColumnHelper.accessor('lastWatchedAt', {
    header: 'Last Watched on',
    cell: ({ cell }) => {
      // TODO show relative time??
      const value = cell.getValue();
      const { date, time } = formatDate(value);

      return (
        <div className="min-w-28">
          <div>{date}</div>
          <div className="text-muted-foreground">{time}</div>
        </div>
      );
    },
  }),
  displayTableColumnHelper.accessor('channelName', {
    header: 'Channel Name',
    cell: ({ cell, row }) => {
      const value = cell.getValue();

      return <NewTabLink link={row.original.channelUrl}>{value}</NewTabLink>;
    },
  }),
  displayTableColumnHelper.accessor('channelAvatarUrl', {
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
  displayTableColumnHelper.display({
    header: 'Tags',
    cell: ({ row }) => {
      // TODO handle videos not watched case

      const watchCount = row.original.watchCount ?? 0;
      return (
        <div className="flex flex-wrap gap-1">
          <Badge className="text-nowrap">Watch count: {watchCount}</Badge>
        </div>
      );
    },
  }),
] as ColumnDef<FinalVideo>[];

export const videoTableColumns = [
  videoTableColumnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
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
  videoTableColumnHelper.display({
    header: 'index',
    cell: ({ cell }) => cell.row.index + 1,
  }),
  videoTableColumnHelper.accessor('youtubeCreatedAt', {
    header: 'Watched on',
    cell: ({ cell }) => {
      const value = cell.getValue();
      const { date, time } = formatDate(value);
      return (
        <div className="min-w-28">
          {date}, {time}
        </div>
      );
    },
  }),
] as ColumnDef<HistoryVideo>[];
