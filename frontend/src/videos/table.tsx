import { PaginationState, RowSelectionState } from '@tanstack/react-table';

import { DataTable } from '@/components/custom/data-table';
import { VideoSchema, VideosSchema } from '@/routes/upload';
import columns from '@/videos/columns';

export default function Table({
  jsonData,
  rowSelection,
  setRowSelection,
  pagination,
  setPagination,
}: {
  jsonData: VideosSchema;
  rowSelection?: RowSelectionState;
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  pagination?: PaginationState;
  setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>;
}) {
  return (
    <DataTable
      data={jsonData}
      columns={columns}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
      pagination={pagination}
      setPagination={setPagination}
    />
  );
}
