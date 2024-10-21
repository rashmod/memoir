import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PaginationState, RowSelectionState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import videosApi from '@/api/videos';
import { DataTable } from '@/components/custom/data-table';
import { userVideoTableColumns } from '@/columns/user-videos';

export const Route = createFileRoute('/')({
  component: Page,
});

function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['user-videos'],
    queryFn: videosApi.getUserVideos,
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
          columns={userVideoTableColumns}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          pagination={pagination}
          setPagination={setPagination}
          onRowClick={(row) => navigate({ to: `/video/${row.videoId}` })}
        />
      )}

      {/* <SelectionActionBar selectedCount={selectedCount} onDeleteSelected={onDeleteSelected} /> */}
    </div>
  );
}
