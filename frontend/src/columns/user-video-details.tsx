import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';

import formatDate from '@/lib/format-date';

import { UserVideoDetailsHistory, UserVideoDetailsPlaylist } from '@/types/table/video';

const userVideoHistoryColumnHelper = createColumnHelper<UserVideoDetailsHistory>();
const userVideoPlaylistColumnHelper = createColumnHelper<UserVideoDetailsPlaylist>();

export const userVideoHistoryColumns = [
  userVideoHistoryColumnHelper.display({
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
  userVideoHistoryColumnHelper.display({
    header: 'index',
    cell: ({ cell }) => cell.row.index + 1,
  }),
  userVideoHistoryColumnHelper.accessor('watchedAt', {
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
] as ColumnDef<UserVideoDetailsHistory>[];

export const userVideoPlaylistColumns = [
  userVideoPlaylistColumnHelper.display({
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
  userVideoPlaylistColumnHelper.display({
    header: 'index',
    cell: ({ cell }) => cell.row.index + 1,
  }),
  userVideoPlaylistColumnHelper.accessor('playlistName', {
    header: 'Playlist',
    cell: ({ cell }) => cell.getValue(),
  }),
  userVideoPlaylistColumnHelper.accessor('addedAt', {
    header: 'Added on',
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
] as ColumnDef<UserVideoDetailsPlaylist>[];
