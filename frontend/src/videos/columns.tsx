import { ColumnDef } from '@tanstack/react-table';

import { Skeleton } from '@/components/ui/skeleton';
import parseISODuration from '@/lib/parse-iso-duration';
import formatDuration from '@/lib/format-duration';
import NewTabLink from '@/components/custom/new-tab-link';

export type Video = {
  id: string;
  title: string;
  time: string;
};

const columns: ColumnDef<Video>[] = [
  {
    accessorKey: 'thumbnail',
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
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ cell, row }) => {
      const value = cell.getValue();

      return <NewTabLink link={row.original.url}>{value}</NewTabLink>;
    },
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ cell }) => {
      const value = cell.getValue() as string | undefined;

      if (!value) return <Skeleton className="h-4 w-20" />;

      const parsedDuration = parseISODuration(value);
      return formatDuration(parsedDuration);
    },
  },
  {
    accessorKey: 'time',
    header: 'Watched on',
    cell: ({ cell }) => {
      // TODO show relative time??
      const value = cell.getValue() as string;
      const date = new Date(value).toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const time = new Date(value).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      return (
        <div className="min-w-20">
          <div>{date}</div>
          <div className="text-muted-foreground">{time}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'channelTitle',
    header: 'Channel Name',
    cell: ({ cell, row }) => {
      const value = cell.getValue();

      return (
        <NewTabLink link={row.original.channelUrl}>{value ? value : <Skeleton className="h-4 w-32" />}</NewTabLink>
      );
    },
  },
  {
    accessorKey: 'channelImage',
    header: 'Channel Image',
    cell: ({ cell }) => {
      const value = cell.getValue();
      if (value) return value;
      return <Skeleton className="aspect-square h-16 rounded-full" />;
    },
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
  },
];

export default columns;
