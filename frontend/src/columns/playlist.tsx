import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';

import formatDate from '@/lib/format-date';

import { BasicPlaylistVideo } from '@/types/table/playlist';

const basicPlaylistColumnHelper = createColumnHelper<BasicPlaylistVideo>();

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
