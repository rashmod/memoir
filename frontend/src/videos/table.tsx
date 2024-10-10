import { PaginationState, RowSelectionState } from '@tanstack/react-table';

import { DataTable } from '@/components/custom/data-table';
import columns from '@/videos/columns';
import { MergedVideo } from '@/videos/types';

export default function Table({
  jsonData,
  rowSelection,
  setRowSelection,
  pagination,
  setPagination,
}: {
  jsonData: MergedVideo[];
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
