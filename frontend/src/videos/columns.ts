import { ColumnDef } from '@tanstack/react-table';

export type Video = {
  id: string;
  title: string;
  time: string;
};

const columns: ColumnDef<Video>[] = [
  {
    accessorKey: 'url',
    header: 'Video url',
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'time',
    header: 'Time',
  },
];

export default columns
