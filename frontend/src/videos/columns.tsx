import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import NewTabLink from '@/components/custom/new-tab-link';

import parseISODuration from '@/lib/parse-iso-duration';
import formatDuration from '@/lib/format-duration';

import { VideoSchema } from '@/routes/upload';

const columnHelper = createColumnHelper<VideoSchema[number]>();

const columns = [
  columnHelper.display({
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
  columnHelper.accessor('thumbnail', {
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
  columnHelper.accessor('title', {
    header: 'Title',
    cell: ({ cell, row }) => {
      const value = cell.getValue();

      return <NewTabLink link={row.original.url}>{value}</NewTabLink>;
    },
  }),
  columnHelper.accessor('duration', {
    header: 'Duration',
    cell: ({ cell }) => {
      const value = cell.getValue() as string | undefined;

      if (!value) return <Skeleton className="h-4 w-20" />;

      const parsedDuration = parseISODuration(value);
      return formatDuration(parsedDuration);
    },
  }),
  columnHelper.accessor('time', {
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
  }),
  columnHelper.accessor('channelTitle', {
    header: 'Channel Name',
    cell: ({ cell, row }) => {
      const value = cell.getValue();

      return (
        <NewTabLink link={row.original.channelUrl}>{value ? value : <Skeleton className="h-4 w-32" />}</NewTabLink>
      );
    },
  }),
  // columnHelper.accessor('channelImage', {
  //   header: 'Channel Image',
  //   cell: ({ cell }) => {
  //     const value = cell.getValue();
  //     if (value) return value;
  //     return <Skeleton className="aspect-square h-16 rounded-full" />;
  //   },
  // // }),
  // {
  //   accessorKey: 'tags',
  //   header: 'Tags',
  // },
];

export default columns;
