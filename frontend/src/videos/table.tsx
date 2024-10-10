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
  getRowId,
}: {
  jsonData: VideosSchema;
  rowSelection?: RowSelectionState;
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  pagination?: PaginationState;
  setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>;
  getRowId?: (row: VideoSchema) => string;
}) {
  return (
    <DataTable
      data={jsonData}
      columns={columns}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
      pagination={pagination}
      setPagination={setPagination}
      getRowId={getRowId}
    />
  );
}
