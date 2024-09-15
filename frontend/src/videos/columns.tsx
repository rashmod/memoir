import { ColumnDef } from '@tanstack/react-table';

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
  },
  {
    accessorKey: 'time',
    header: 'Watched on',
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
