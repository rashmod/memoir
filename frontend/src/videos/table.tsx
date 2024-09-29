import { RowSelectionState } from '@tanstack/react-table';

import { DataTable } from '@/components/custom/data-table';
import { VideosSchema } from '@/routes/upload';
import columns from '@/videos/columns';

export default function Table({
  jsonData,
  rowSelection,
  setRowSelection,
}: {
  jsonData: VideosSchema;
  rowSelection?: RowSelectionState;
  setRowSelection?: (value: RowSelectionState | ((prevState: RowSelectionState) => RowSelectionState)) => void;
}) {
  return <DataTable data={jsonData} columns={columns} rowSelection={rowSelection} setRowSelection={setRowSelection} />;
}
