import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import NewTabLink from '@/components/custom/new-tab-link';

import formatDuration from '@/lib/format-duration';

import { FinalVideo, MergedVideo, HistoryVideo } from '@/videos/types';
import { Badge } from '@/components/ui/badge';
import formatDate from '@/lib/format-date';

const uploadTableColumnHelper = createColumnHelper<MergedVideo>();
const displayTableColumnHelper = createColumnHelper<FinalVideo>();
const videoTableColumnHelper = createColumnHelper<HistoryVideo>();

export const uploadTableColumns = [
  uploadTableColumnHelper.display({
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
  uploadTableColumnHelper.display({
    header: 'index',
    cell: ({ cell }) => cell.row.index + 1,
  }),
  uploadTableColumnHelper.accessor('thumbnailUrl', {
    header: 'Thumbnail',
    cell: ({ cell, row }) => {
      const value = cell.getValue();

      return (
        <NewTabLink link={row.original.url}>
          {value ? (
            <img src={value} className="aspect-video h-20 object-cover" />
          ) : (
            <Skeleton className="aspect-video h-20" />
          )}
        </NewTabLink>
      );
    },
  }),
  uploadTableColumnHelper.accessor('title', {
    header: 'Title',
    cell: ({ cell, row }) => {
      const value = cell.getValue();

      return <NewTabLink link={row.original.url}>{value}</NewTabLink>;
    },
  }),
  uploadTableColumnHelper.accessor('duration', {
    header: 'Duration',
    cell: ({ cell }) => {
      const value = cell.getValue();

      if (!value) return <Skeleton className="h-4 w-20" />;

      return formatDuration(value);
    },
  }),
  uploadTableColumnHelper.accessor('time', {
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
  uploadTableColumnHelper.accessor('channelName', {
    header: 'Channel Name',
    cell: ({ cell, row }) => {
      const value = cell.getValue();

      return (
        <NewTabLink link={row.original.channelUrl}>{value ? value : <Skeleton className="h-4 w-32" />}</NewTabLink>
      );
    },
  }),
  uploadTableColumnHelper.accessor('channelAvatarUrl', {
    header: 'Channel Avatar',
    cell: ({ cell, row }) => {
      const value = cell.getValue();
      return (
        <NewTabLink link={row.original.channelUrl}>
          {value ? (
            <img src={value} className="aspect-square h-16 rounded-full" />
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
] as ColumnDef<MergedVideo>[];

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
        <NewTabLink link={row.original.url}>
          <img src={value} className="aspect-video h-20 object-cover" />
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
          <img src={value} className="aspect-square h-16 rounded-full" />
        </NewTabLink>
      );
    },
  }),
  displayTableColumnHelper.display({
    header: 'Tags',
    cell: ({ row }) => {
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
  uploadTableColumnHelper.display({
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
] as ColumnDef<Video>[];
