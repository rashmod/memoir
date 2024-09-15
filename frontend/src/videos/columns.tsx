import { ColumnDef } from '@tanstack/react-table';

import parseISODuration from '@/lib/parse-iso-duration';
import formatDuration from '@/lib/format-duration';

export type Video = {
  id: string;
  title: string;
  time: string;
};

const columns: ColumnDef<Video>[] = [
  {
    accessorKey: 'thumbnail',
    header: 'Thumbnail',
    cell: ({ cell }) => {
      const value = cell.getValue();
      if (value) return <img src={value} className="aspect-video h-20 object-cover" />;
      return <div className="h-2 w-12 bg-red-500"></div>;
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
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
    cell: ({ cell }) => {
      const value = cell.getValue();
      if (value) return value;
      return <div className="h-2 w-12 bg-red-500"></div>;
    },
  },
  {
    accessorKey: 'channelImage',
    header: 'Channel Image',
    cell: ({ cell }) => {
      const value = cell.getValue();
      if (value) return value;
      return <div className="h-2 w-12 bg-red-500"></div>;
    },
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
  },
];

export default columns;
