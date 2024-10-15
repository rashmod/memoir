import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PaginationState, RowSelectionState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import videosApi from '@/api/videos';
import { DataTable } from '@/components/custom/data-table';
import { displayTableColumns } from '@/videos/columns';

export const Route = createFileRoute('/')({
  component: Page,
});

function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: videosApi.getHistory,
  });

  const navigate = useNavigate();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 100 });

  const selectedCount = useMemo(() => Object.keys(rowSelection).length, [rowSelection]);

  // function onDeleteSelected() {
  //   setJsonData((prev) => prev.filter((item) => !rowSelection[item.youtubeId]));
  //   setRowSelection({});
  // }

  return (
    <div className="relative grid w-full gap-4">
      {isLoading && <div>Loading...</div>}
      {data && (
        <DataTable
          data={data.data}
          columns={displayTableColumns}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          pagination={pagination}
          setPagination={setPagination}
          onRowClick={(row) => navigate({ to: `/video/${row.youtubeId}` })}
        />
      )}
      {/* <SelectionActionBar selectedCount={selectedCount} onDeleteSelected={onDeleteSelected} /> */}
    </div>
  );
}
